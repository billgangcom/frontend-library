// import { AreaChart, Area, CartesianGrid, ResponsiveContainer } from "recharts";

// const ChartItem = (
//   {
//     data, title, value
//   },
// ) => {
//   return (
//     <div className="flex flex-col justify-between rounded-xl border-[1px] border-borderDefault p-6">
//       <div className="text-textSecondary">{title}</div>
//       <div className="text-xxl font-bold">{value}</div>
//       <ResponsiveContainer width="100%" height={70}>
//         <AreaChart data={data}>
//           <defs>
//             <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="10%" stopColor="#FF3F19" stopOpacity={0.2} />
//               <stop offset="100%" stopColor="#FF3F19" stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <CartesianGrid
//             strokeDasharray="5 5"
//             horizontalPoints={[0, 23, 46, 70]}
//             vertical={false}
//           />
//           <Area
//             type="monotone"
//             dataKey="value"
//             stroke="#FF3F19"
//             fillOpacity={1}
//             fill="url(#colorPrimary)"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// export default ChartItem
