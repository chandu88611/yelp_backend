// // src/scripts/export-icons.tsx

// import * as fs from 'fs'
// import * as path from 'path'

// import React from 'react'
// import ReactDOMServer from 'react-dom/server'
// import type { IconType } from 'react-icons'

// import {
//   FaSpa,
//   FaUtensils,
//   FaRunning,
//   FaCar,
//   FaGraduationCap,
//   FaHome,
//   FaCocktail,
//   FaCalendarAlt,
//   FaMoneyCheckAlt,
//   FaHeartbeat,
//   FaHotel,
//   FaNetworkWired,
//   FaLaptopCode,
//   FaBalanceScale,
//   FaPalette,
//   FaMusic,
//   FaPaw,
//   FaBuilding,
//   FaShoppingBag,
//   FaBriefcase,
//   FaTools,
//   FaDumbbell,
//   FaCameraRetro,
//   FaTruck,
// } from 'react-icons/fa'

// const icons: Record<string, IconType> = {
//   FaSpa,
//   FaUtensils,
//   FaRunning,
//   FaCar,
//   FaGraduationCap,
//   FaHome,
//   FaCocktail,
//   FaCalendarAlt,
//   FaMoneyCheckAlt,
//   FaHeartbeat,
//   FaHotel,
//   FaNetworkWired,
//   FaLaptopCode,
//   FaBalanceScale,
//   FaPalette,
//   FaMusic,
//   FaPaw,
//   FaBuilding,
//   FaShoppingBag,
//   FaBriefcase,
//   FaTools,
//   FaDumbbell,
//   FaCameraRetro,
//   FaTruck,
// }

// const exportDir = path.resolve(__dirname, '../public/icons')

// if (!fs.existsSync(exportDir)) {
//   fs.mkdirSync(exportDir, { recursive: true })
// }

// Object.entries(icons).forEach(([name, Icon]) => {
//   const svg = ReactDOMServer.renderToStaticMarkup(<Icon size={24} />)
//   fs.writeFileSync(path.join(exportDir, `${name}.svg`), svg)
// })

// console.log('SVG icons exported!')
