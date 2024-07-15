import { atom } from '@reatom/framework'
import { useAtom } from '@reatom/npm-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type OrderRequest,
  type PartOrder,
  fetchProducts,
  postOrder,
  validateCoupon,
} from '../api/index.js'
import { tokenAtom } from '../auth/model.js'
import { ctx } from '../index.js'

const Balance = 'Balance'

type Image = { id: number; cfId: string }
type Price = { amount: number; currency: string }
type Gateway = { name: string }
type Quantity = { available: number; restrictions: Record<string, unknown> }
type DiscordSettings = { isEnabled: boolean; isRequired: boolean }
type Variant = {
  id: number
  name: string
  price: Price
  quantity: Quantity
  deliveryTime: number
  gateways: Gateway[]
  customFields: unknown[]
  discordSettings: DiscordSettings
  description?: string
  compareAtPrice?: Price
}
type Review = {
  id: number
  message: string
  rating: number
  createdAtIso: string
  purchasedIso: string
}
type Stats = { averageRating: number; totalReviews: number; totalSold: number }
type Product = {
  id: number
  uniquePath: string
  name: string
  shortDescription: string
  description: string
  images: Image[]
  variants: Variant[]
  stats: Stats
  reviews: Review[]
}
type Products = Product[]

const defaultCart = {
  recaptcha: '',
  gateway: '',
  parts: [],
  customFields: {},
  discordSocialConnectId: null,
  coupon: null,
}

type CreateOrderResponseBody = { data: { id: string; fullAccessToken: string } }
type ValidateCouponApiData = {
  restrictToProductIds?: number[]
  isFixed?: boolean
  discount?: number
}

const validateProductAndVariant = (
  products: Products,
  cartItem: PartOrder,
): Variant => {
  const { productId, productVariantId, quantity } = cartItem
  const product = products.find((p) => p.id === productId)

  if (!product) throw new Error('Product does not exist')

  const variant = product.variants.find((v) => v.id === productVariantId)
  if (!variant) throw new Error('Variant does not exist')
  if (quantity !== undefined && variant.quantity.available < quantity)
    throw new Error('Not enough quantity available')

  return variant
}

const calculateTotalPrice = (cart: PartOrder[], products: Products): number =>
  cart.reduce((total, cartItem) => {
    const product = products.find((p) => p?.id === cartItem.productId)
    const variant = product?.variants.find(
      (v) => v.id === cartItem.productVariantId,
    )
    return variant ? total + variant.price.amount * cartItem.quantity : total
  }, 0)

const getGatewaysFromVariant = (variant: Variant) =>
  new Set(variant.gateways.map((g) => g.name))

const emptyGateways = { availableGateways: [], requiresSignInGateways: [] }

const getCommonGateways = (cartItems: PartOrder[], products: Product[]) => {
  if (products.length === 0) return emptyGateways

  const firstProductVariant = products[0]?.variants[0]
  if (!firstProductVariant) return emptyGateways

  const availableGateways = getGatewaysFromVariant(firstProductVariant)

  for (const cartItem of cartItems) {
    const product = products.find((p) => p.id === cartItem.productId)
    if (!product) continue

    const variant = product.variants.find(
      (v) => v.id === cartItem.productVariantId,
    )
    if (!variant) continue

    const variantGateways = getGatewaysFromVariant(variant)

    for (const gateway of availableGateways) {
      if (!variantGateways.has(gateway)) availableGateways.delete(gateway)
    }
  }

  const token = ctx.get(tokenAtom)

  if (!token && availableGateways.has(Balance)) {
    availableGateways.delete(Balance)
    return {
      availableGateways: [...availableGateways],
      requiresSignInGateways: [Balance],
    }
  }

  return {
    availableGateways: [...availableGateways],
    requiresSignInGateways: [],
  }
}

export const useCart = (customerEmail: string) => {
  const [pending, setPending] = useState<boolean>(false)

  const cartAtom = useMemo(
    () => atom<OrderRequest>({ customerEmail, ...defaultCart }),
    [customerEmail],
  )

  const couponAtom = useMemo(() => atom<ValidateCouponApiData>({}), [])

  const productsAtom = useMemo(() => atom<Products>([]), [])

  const getProducts = useCallback(
    async (ids?: string[]) => {
      setPending(true)
      const res = await fetchProducts(ids)
      productsAtom(ctx, res)
      setPending(false)
      return res
    },
    [productsAtom],
  )

  const applyCoupon = useCallback(
    async (coupon: string) => {
      setPending(true)
      const { gateway, parts } = ctx.get(cartAtom)

      if (!gateway) throw new Error('There should be a gateway for the coupon')

      cartAtom(ctx, (cart) => ({ ...cart, coupon }))
      const productIds = parts.map((i) => i.productId)

      const res: ValidateCouponApiData = (
        await validateCoupon({ gateway, couponName: coupon, productIds })
      ).data

      if (
        res.restrictToProductIds?.length &&
        !productIds.every((id) => res.restrictToProductIds?.includes(id))
      ) {
        throw new Error("Coupon can't be applied to such products")
      }

      couponAtom(ctx, res)
      setPending(false)
      return res
    },
    [cartAtom, couponAtom],
  )

  const addProductToCart = useCallback(
    (cartItem: PartOrder) => {
      const products = ctx.get(productsAtom)
      validateProductAndVariant(products, cartItem)

      const currentParts = ctx.get(cartAtom).parts

      if (
        currentParts.some(
          (part) =>
            part.productId === cartItem.productId &&
            part.productVariantId === cartItem.productVariantId,
        )
      ) {
        throw new Error(
          'Product with same ID and VariantID already exists in the cart',
        )
      }

      if (
        currentParts.length &&
        !getCommonGateways([...currentParts, cartItem], products)
          .availableGateways.length
      ) {
        throw new Error('No common payment gateways available')
      }

      cartAtom(ctx, (cart) => ({
        ...cart,
        parts: [...cart.parts, cartItem],
      }))
    },
    [cartAtom, productsAtom],
  )

  const actions = useMemo(
    () => ({
      reset() {
        cartAtom(ctx, { customerEmail, ...defaultCart })
        productsAtom(ctx, [])
      },
      addProductToCart,
      removeProduct({ productId, productVariantId }: PartOrder) {
        cartAtom(ctx, (cart) => ({
          ...cart,
          parts: cart.parts.filter(
            (i) =>
              i.productId !== productId &&
              i.productVariantId !== productVariantId,
          ),
        }))
      },
      getPossibleGateways() {
        return getCommonGateways(ctx.get(cartAtom).parts, ctx.get(productsAtom))
      },
      setRecapcha(recaptcha: string) {
        cartAtom(ctx, (cart) => ({ ...cart, recaptcha }))
      },
      updateQuantityOfProduct(cartItem: PartOrder) {
        const products = ctx.get(productsAtom)
        validateProductAndVariant(products, cartItem)

        cartAtom(ctx, (cart) => ({
          ...cart,
          parts: ctx
            .get(cartAtom)
            .parts.map((i) =>
              i.productId === cartItem.productId &&
              i.productVariantId === cartItem.productVariantId
                ? { ...i, quantity: cartItem.quantity }
                : i,
            ),
        }))
      },
      getTotalAndDiscount() {
        const total = calculateTotalPrice(
          ctx.get(cartAtom).parts,
          ctx.get(productsAtom),
        )
        const coupon = ctx.get(couponAtom)

        let totalWithDiscount: number | undefined

        if (coupon.discount) {
          totalWithDiscount = coupon.isFixed
            ? Math.max(0, total - coupon.discount)
            : total * (1 - coupon.discount / 100)
        }

        return { total, totalWithDiscount }
      },
      setPaymentMethod(gateway: string) {
        cartAtom(ctx, (cart) => ({ ...cart, gateway }))
        if (ctx.get(cartAtom).coupon)
          applyCoupon(ctx.get(cartAtom).coupon as string)
      },
      async submitCart() {
        setPending(true)
        const res: CreateOrderResponseBody = await postOrder(ctx.get(cartAtom))
        setPending(false)
        return res
      },
      setDiscordSocialConnectId(discordSocialConnectId: string) {
        cartAtom(ctx, (cart) => ({ ...cart, discordSocialConnectId }))
      },
      setCustomFields(customFields: Record<string, string>) {
        cartAtom(ctx, (cart) => ({ ...cart, customFields }))
      },
    }),
    [
      customerEmail,
      productsAtom,
      cartAtom,
      couponAtom,
      applyCoupon,
      addProductToCart,
    ],
  )

  useEffect(() => {
    async function fetchInitialProducts() {
      await getProducts()
    }
    fetchInitialProducts()
  }, [getProducts])

  return {
    cart: useAtom(cartAtom)[0],
    products: useAtom(productsAtom)[0],
    coupon: useAtom(couponAtom)[0],
    pending,
    getProducts,
    applyCoupon,
    ...actions,
  }
}
