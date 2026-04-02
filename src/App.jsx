import { useState, useEffect, useMemo, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell, Area, AreaChart } from "recharts";

const API_BASE = "https://r-v-price-monitor-production.up.railway.app";

const RAW = {"dates":["2016-12","2017-01","2017-02","2017-03","2017-04","2017-05","2017-06","2017-07","2017-08","2017-09","2017-10","2017-11","2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06","2018-07","2018-08","2018-09","2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02"],"datesVar":["2017-01","2017-02","2017-03","2017-04","2017-05","2017-06","2017-07","2017-08","2017-09","2017-10","2017-11","2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06","2018-07","2018-08","2018-09","2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02"],"datesYoY":["2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06","2018-07","2018-08","2018-09","2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02"],"nivelGeneral":{"indices":[100,101.59,103.69,106.15,108.97,110.53,111.85,113.79,115.38,117.57,119.35,120.99,124.8,126.99,130.06,133.11,136.75,139.59,144.81,149.3,155.1,165.24,174.15,179.64,184.26,189.61,196.75,205.96,213.05,219.57,225.54,230.49,239.61,253.71,262.07,273.22,283.44,289.83,295.67,305.55,310.12,314.91,321.97,328.2,337.06,346.62,359.66,371.02,385.88,401.51,415.86,435.87,453.65,468.73,483.6,498.1,510.39,528.5,547.08,560.92,582.46,605.03,633.43,676.06,716.94,753.15,793.03,851.76,911.13,967.31,1028.71,1079.28,1134.59,1202.98,1282.71,1381.16,1497.21,1613.59,1709.61,1818.08,2044.28,2304.92,2496.27,2816.06,3533.19,4261.53,4825.79,5357.09,5830.23,6073.72,6351.71,6607.75,6883.44,7122.24,7313.95,7491.43,7694.01,7864.13,8053,8353.32,8585.61,8714.49,8855.57,9023.97,9193.24,9384.09,9603.86,9841.36,10121.37,10413.03,10714.63],"varMensual":[1.6,2.1,2.4,2.7,1.4,1.2,1.7,1.4,1.9,1.5,1.4,3.1,1.8,2.4,2.3,2.7,2.1,3.7,3.1,3.9,6.5,5.4,3.2,2.6,2.9,3.8,4.7,3.4,3.1,2.7,2.2,4,5.9,3.3,4.3,3.7,2.3,2,3.3,1.5,1.5,2.2,1.9,2.7,2.8,3.8,3.2,4,4,3.6,4.8,4.1,3.3,3.2,3,2.5,3.5,3.5,2.5,3.8,3.9,4.7,6.7,6,5.1,5.3,7.4,7,6.2,6.3,4.9,5.1,6,6.6,7.7,8.4,7.8,6,6.3,12.4,12.7,8.3,12.8,25.5,20.6,13.2,11,8.8,4.2,4.6,4,4.2,3.5,2.7,2.4,2.7,2.2,2.4,3.7,2.8,1.5,1.6,1.9,1.9,2.1,2.3,2.5,2.8,2.9,2.9],"varInteranual":[24.8,25,25.4,25.4,25.5,26.3,29.5,31.2,34.4,40.5,45.9,48.5,47.6,49.3,51.3,54.7,55.8,57.3,55.8,54.4,54.5,53.5,50.5,52.1,53.8,52.9,50.3,48.4,45.6,43.4,42.8,42.4,40.7,36.6,37.2,35.8,36.1,38.5,40.7,42.6,46.3,48.8,50.2,51.8,51.4,52.5,52.1,51.2,50.9,50.7,52.3,55.1,58,60.7,64,71,78.5,83,88,92.4,94.8,98.8,102.5,104.3,108.8,114.2,115.6,113.4,124.4,138.3,142.7,160.9,211.4,254.2,276.2,287.9,289.4,276.4,271.5,263.4,236.7,209,193,166,117.8,84.5,66.9,55.9,47.3,43.5,39.4,36.6,33.6,31.8,31.3,31.4,31.5,32.4,33.1]},"categorias":{"Núcleo":{"varMensual":[1.5,1.7,1.9,2.1,1.7,1.3,1.8,1.4,1.6,1.3,1.3,1.7,1.5,2.1,2.6,2.1,2.7,4.1,3.2,3.4,7.6,4.5,3.3,2.7,3,3.9,4.6,3.8,3.2,2.7,2.1,4.6,6.4,3.8,4,3.7,2.4,2.4,3.1,1.7,1.6,2.3,2.5,3,2.3,3.5,3.9,4.9,3.9,4.1,4.5,4.6,3.5,3.6,3.1,3.1,3.3,3.2,3.3,4.4,3.3,4.5,6.4,6.7,5.2,5.1,7.3,6.8,5.5,5.5,4.8,5.3,5.4,7.7,7.2,8.4,7.8,6.5,6.5,13.8,13.4,8.8,13.4,28.3,20.2,12.3,9.4,6.3,3.7,3.7,3.8,4.1,3.3,2.9,2.7,3.2,2.4,2.9,3.2,3.2,2.2,1.7,1.5,2,1.9,2.2,2.6,3,2.6,3.1]}},"divisiones":[{"nombre":"Alimentos y bebidas no alcohólicas","short":"Alimentos","peso":23.44,"varMensual":[1.3,1.8,2.8,2.2,1.3,0.9,1.1,2.1,1.8,1.5,1.2,0.7,2.1,2.2,2.3,1.2,3.3,5.2,4,4,7,5.9,3.4,1.7,3.4,5.7,6,2.5,2.4,2.6,2.3,4.5,5.7,2.5,5.3,3.1,4.7,2.7,3.9,3.2,0.7,1,1.3,3.5,3,4.8,2.7,4.4,4.8,3.8,4.6,4.3,3.1,3.2,3.4,1.5,2.9,3.4,2.1,4.3,4.9,7.5,7.2,5.9,4.4,4.6,6,7.1,6.7,6.2,3.5,4.7,6.8,9.8,9.3,10.1,5.8,4.1,5.8,15.6,14.3,7.7,15.7,29.7,20.4,11.9,10.5,6,4.8,3,3.2,3.6,2.3,1.2,0.9,2.2,1.8,3.2,5.9,2.9,0.5,0.6,1.9,1.4,1.9,2.3,2.8,3.1,4.7,3.3]},{"nombre":"Bebidas alcohólicas y tabaco","short":"Bebidas y tabaco","peso":3.27,"varMensual":[0.9,4.3,1.9,2.4,1.7,0.7,3,1.3,0.7,3,1.1,0.5,2.3,1.7,0.7,1.3,1.6,0.9,2.6,1.4,4.4,2.3,4.6,1.4,3.5,2.4,4.1,1,2.2,2.7,0.9,4.4,5.7,6.2,5.6,3.1,4.3,1.3,2.9,1.4,0.1,3.8,1.4,1.3,4.3,1.9,3,3.4,4.5,3.6,6.4,3.6,1.6,5.5,3.1,2,5.9,2.2,1.1,5.4,1.8,2.7,5.7,3.3,5.7,6.7,6.4,7,9.4,5.4,6.3,7.1,7.3,5.2,8.3,3.8,8.4,4.5,9,8.5,11.5,9.8,11.8,20.2,21,17.7,12.3,5.5,6.7,2.1,6.1,3,2.2,3,4,2.5,2.4,1.3,0.8,2.8,0.6,2.8,0.6,3.5,1.6,2.4,1.2,2.8,1.5,0.6]},{"nombre":"Vivienda, agua, electricidad, gas y otros combustibles","short":"Vivienda y servicios","peso":10.46,"varMensual":[1.5,5.4,3.6,5.9,1.8,1.8,2,2.2,2,0.9,1.2,17.8,1,3.8,0.6,8,-0.7,2.7,1,6.2,2.3,8.8,2.1,3,3.1,6.4,2.8,2.9,4,2.7,2.2,2.1,2,1.9,1.5,2.1,0.6,0.6,1.4,0,0.1,0.9,1,2.3,1.5,2.3,2.5,3,1.1,2,1.3,3.5,2,2.5,2.9,1.1,1.9,2.5,2.2,2.1,1.8,2.8,7.7,4.6,3.6,6.8,4.6,5.5,3.1,7.5,8.7,4.2,8,4.8,6.5,5.6,11.9,8.1,4,9.1,8.5,7.8,7.1,13.8,14,20.2,13.3,35.6,2.5,14.3,6,7,7.3,5.4,4.5,5.3,4,3.7,2.9,1.9,2.4,3.4,1.5,2.7,3.1,2.8,3.4,3.4,3,6.8]},{"nombre":"Equipamiento y mantenimiento del hogar","short":"Equipamiento hogar","peso":6.27,"varMensual":[0.9,0.4,0.8,1.1,2.8,1.3,2.4,1,1,0.7,0.9,2.9,1,1.7,4.5,1.2,2.2,4,4.2,3.1,9.7,4.3,3.6,1.9,2.7,2.8,3.8,4.6,3.2,3.4,2.5,6.1,7.4,8.1,0.6,5.4,-1.3,2.1,2.9,1.2,2.8,4.1,3.9,3.5,2.6,4.5,3.9,2.4,3,4.6,3.2,4.3,2.4,3.2,2.7,3.3,3.5,2.8,2.7,3.4,3.3,4.4,4.4,5.5,5.4,6,10.3,8.4,6,4.9,5.4,5.9,5.4,5.1,5.8,8.6,8.8,8,6.2,14.1,12.7,10.7,12.4,30.7,22.3,10.3,5,6.5,3.2,2.3,3.5,4.3,2.7,2.6,1.5,0.9,1.6,1,1.5,0.9,1.4,1.9,1.5,0.9,2.2,1.6,1.1,2,1.8,2.6]},{"nombre":"Salud","short":"Salud","peso":8.8,"varMensual":[2.4,2.7,2,1.8,1.5,1.5,3.3,2.5,2.4,1.1,1.3,2.4,1.8,2.3,1.3,1.8,2.2,4.3,2.8,4.1,4.5,5.5,5.7,5.2,2.9,3.2,3.2,3.5,5.1,3.6,4.1,5.2,8.3,4.7,6.3,5.6,-2,0.4,2.7,1.2,1.1,2.2,2.2,2.4,3.5,3.1,3.7,5.2,3.4,3.5,4,3.7,4.8,3.2,3.8,4.2,4.3,4.7,2.4,0.5,4.1,3.6,5,6.4,6.2,7.4,6.8,5.7,4.3,7.1,4.1,5.7,4.9,5.3,5.7,6.6,9,8.6,9,15.3,9.5,5.1,15.9,32.6,20.5,13.6,12.2,9.1,0.7,4.7,5.8,4.1,3.3,3.6,2.9,2.1,2.4,2.1,1.8,2.5,2.7,2.2,1.1,1.7,2.3,1.8,2.4,2.1,2.3,2.5]},{"nombre":"Transporte","short":"Transporte","peso":11.59,"varMensual":[2.1,1.9,1.2,0.6,0.9,0.7,2.2,1.1,0.8,1.3,3,3.2,2.2,4.5,1.8,4,1.9,5.9,5.2,4,10.4,7.6,2.7,2.4,2.5,2.2,4.2,4.4,3.5,1.6,1.1,4,4.7,3.5,4.6,5,1.5,1.6,1.6,1.3,1.1,1.8,1.8,2.8,3.6,4.2,3.6,4.9,4.6,4.8,4.2,5.7,6,3.3,2.3,2.4,3,3.1,2.2,4.9,2.8,4.9,5.5,5.3,6.1,4.7,5.5,6.8,5.8,4.5,6.1,5.8,5.9,4.9,5.3,6.5,8.1,6.5,5.3,10.5,10.8,7.1,10.4,31.7,26.3,21.6,13,6.3,4,3.9,2.6,5.1,3.4,1.2,3.4,2.2,1.2,1.7,1.7,1.7,0.4,1.6,2.8,3.6,3,3.5,3,4,1.8,2]},{"nombre":"Comunicación","short":"Comunicación","peso":2.81,"varMensual":[3.1,4.1,3.2,6.8,0.3,1.2,0.9,1.5,1.1,5.3,0.7,1.7,1.9,9.1,2.7,1,3.9,0.4,0.6,12.4,2.1,0.7,3,7.7,7.4,1.1,4.4,3.5,2,7.1,0.2,1.2,6.7,0.5,7.4,9.6,0.1,2.3,8.3,-4.1,0.3,0.4,0.7,0.3,0.1,-0.1,-0.6,0,15.1,1.8,0.1,0.5,1,7,0.4,-0.6,2.8,1.1,0.8,1.8,7.5,1.5,3.4,3.7,3.1,0.4,5.5,4.1,2.5,12.1,6.4,3.4,8,7.8,1.9,6.3,6.7,10.5,12.2,4.5,9.6,12.6,15.2,15.6,25.1,24.7,15.9,14.2,8.2,5.3,3.5,4.9,3,2.1,1.5,5,2.3,2.3,2.5,2.8,4.1,1.8,2.3,1.9,2.2,2.2,2.7,3.3,3.6,1.8]},{"nombre":"Recreación y cultura","short":"Recreación y cultura","peso":7.46,"varMensual":[3.2,0.6,1.7,2.6,0.7,2.3,3.6,0.7,2.7,1.3,0.7,0.7,3.5,1,1.2,1.9,2.5,3.4,5.1,3.3,6.8,2.7,2.8,2.6,3.5,2.2,2,3.2,2.4,3.7,3.9,4.2,7.6,2,3.4,2.4,5,2.2,2.5,2.3,2.5,4.2,3.3,3.3,1.9,2.6,5.1,5.2,4.8,2.3,5.3,1.5,3.1,2.2,3.1,3.7,3.8,4,1.5,4,4.2,2.3,3.3,5.2,5.2,4.3,13.2,5,5.2,5.6,4.2,4.6,9,6.1,4.4,7.5,8.4,6.5,11.2,11.6,15.1,9.3,13.2,20.2,24,8.6,8.5,7.1,4.6,5.6,5.7,3.7,2.1,2.9,3,2.8,2.5,2.9,0.2,4,1.7,2.5,4.8,0.5,1.3,1.6,2.4,2.5,1,2.3]},{"nombre":"Restaurantes y hoteles","short":"Restaurantes y hoteles","peso":10.84,"varMensual":[3.1,1.7,1,1.9,1.5,1.3,2.6,0.7,1.4,1.4,1.8,1.8,2.9,2.1,1.8,2.3,2.4,2.7,2.9,2.4,5.7,3.1,2.6,2.7,3.7,3.6,4.3,4.1,2.2,2.5,3,3.6,5.2,2.5,3.3,3.3,4.2,3.1,2.2,1.5,1.5,2.2,1.9,1.9,1.7,3.4,3.2,4.6,5.4,5.4,3.1,3.9,3.7,3.1,4.8,2.9,4.1,4.1,5,5.9,5.7,4.3,5.4,7.3,5.7,6.2,9.8,6.7,4.8,7.4,5.5,7.2,6.2,7.5,7.9,9.9,9.3,6.3,7.5,12.4,13.2,8.8,12,21.6,19.4,11.2,8.3,7.3,5.5,6.3,6.5,4.8,3.7,4.3,3.6,4.6,5.3,2.3,3.9,4.1,3,2.1,2.8,3.4,1.1,2.2,2.5,3.2,4.1,3]},{"nombre":"Bienes y servicios varios","short":"Bienes y serv. varios","peso":3.55,"varMensual":[1.9,1.8,1.8,1.8,1.3,1.3,1.3,1.6,1.7,1.4,1.2,1.1,2.4,1.8,1.9,1.7,2,3.2,3.9,4.9,7.9,6.2,4.4,3.4,3.6,3.1,3.1,3,2.8,2.1,2.7,4.4,8.2,3.8,4.9,3.6,3.1,2.4,2,0.2,1.9,0.3,2.3,3.3,1.8,2.1,2.6,1.7,2,3.2,2.2,3.6,2.9,2,3.2,3.3,2.2,3.3,2,3.2,4.3,4.3,5.5,5.3,4.6,5,8.1,8.7,6.8,6.1,5.8,5.7,6.8,6.5,6.3,6.6,7.1,6.6,6.3,9.4,11.7,7.7,11.5,32.7,44.4,16.6,9.6,5.7,4.3,2.8,3.5,2.3,3.3,2.8,2.3,2.1,2.5,2.9,3.2,2.5,2.6,1,2.1,2.2,2.1,2.4,2.5,2.6,2.7,3.3]}]};

const RV_DIVISIONES = RAW.divisiones.filter(d => d.short !== "Indumentaria" && d.short !== "Educación");

const C = {
  bg: "#06080d", card: "#0d1017", cardHover: "#141924", border: "#1a2035",
  borderLt: "#243050", text: "#e4e8f1", muted: "#6878a0", dim: "#374266",
  teal: "#43d9ad", tealBg: "rgba(67,217,173,0.08)", tealBorder: "rgba(67,217,173,0.2)",
  red: "#ef6461", redBg: "rgba(239,100,97,0.1)", amber: "#f0b429",
  blue: "#5b9cf6", purple: "#a78bfa", orange: "#ff9f43",
  greenGlow: "rgba(67,217,173,0.3)",
};
const FONT = "'Space Grotesk','DM Sans',system-ui,sans-serif";
const MONO = "'IBM Plex Mono','JetBrains Mono',monospace";
const DIV_COLORS = ["#43d9ad","#5b9cf6","#a78bfa","#ef6461","#f0b429","#e879a8","#36d6c5","#ff9f43","#7c83ff","#45b7d1"];
const fmt = (n,d=1) => n==null?"—":n.toLocaleString("es-AR",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtIdx = n => n==null?"—":n.toLocaleString("es-AR",{minimumFractionDigits:0,maximumFractionDigits:0});
const monthLabel = d => { const [y,m]=d.split("-"); const ms=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]; return `${ms[+m-1]} ${y.slice(2)}`; };
const dayLabel = d => { const parts = d.split("-"); return `${parts[2]}/${parts[1]}`; };

function TimeRangeSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[["all","Todo"],["3y","3 años"],["2y","2 años"],["1y","1 año"]].map(([k,l]) => (
        <button key={k} onClick={() => onChange(k)} style={{
          background: value===k ? C.tealBg : "transparent", color: value===k ? C.teal : C.dim,
          border: `1px solid ${value===k ? C.tealBorder : "transparent"}`, borderRadius: 5,
          padding: "3px 10px", fontSize: 10, fontFamily: MONO, cursor: "pointer", fontWeight: 500
        }}>{l}</button>
      ))}
    </div>
  );
}

export default function IPCDashboard() {
  const [tab, setTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("all");
  const [selDiv, setSelDiv] = useState(null);
  const [proxy, setProxy] = useState(null);
  const [proxyStatus, setProxyStatus] = useState("loading");
  const [intrames, setIntrames] = useState(null);
  const [intramesStatus, setIntramesStatus] = useState("loading");
  const [monthStatus, setMonthStatus] = useState(null);

  // Fetch API data
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/v1/index/nivel-general`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/v1/index/divisiones`).then(r => r.json()).catch(() => null),
    ]).then(([indexData, divData]) => {
      if (indexData && !indexData.error) {
        setProxy({ index: indexData, divisiones: divData });
        setProxyStatus("ok");
      } else { setProxyStatus("error"); }
    }).catch(() => setProxyStatus("error"));

    // Fetch intrames data
    fetch(`${API_BASE}/api/v1/index/intrames`).then(r => r.json())
      .then(d => { setIntrames(d); setIntramesStatus(d.error ? "no_data" : "ok"); })
      .catch(() => setIntramesStatus("error"));

    // Fetch month status
    fetch(`${API_BASE}/api/v1/index/month-status`).then(r => r.json())
      .then(d => setMonthStatus(d))
      .catch(() => null);
  }, []);

  const refreshProxy = () => {
    setProxyStatus("loading");
    fetch(`${API_BASE}/api/v1/index/nivel-general`).then(r => r.json())
      .then(d => { setProxy(p => ({ ...p, index: d })); setProxyStatus("ok"); })
      .catch(() => setProxyStatus("error"));
  };

  const refreshIntrames = () => {
    setIntramesStatus("loading");
    fetch(`${API_BASE}/api/v1/index/intrames`).then(r => r.json())
      .then(d => { setIntrames(d); setIntramesStatus(d.error ? "no_data" : "ok"); })
      .catch(() => setIntramesStatus("error"));
  };

  const varMensualData = useMemo(() => RAW.datesVar.map((date, i) => ({ date, label: monthLabel(date), varMensual: RAW.nivelGeneral.varMensual[i] })), []);
  const varYoYData = useMemo(() => RAW.datesYoY.map((date, i) => ({ date, label: monthLabel(date), varYoY: RAW.nivelGeneral.varInteranual[i] })), []);

  const filterByRange = (data) => {
    if (timeRange === "all") return data;
    const n = timeRange === "3y" ? 36 : timeRange === "1y" ? 12 : 24;
    return data.slice(-n);
  };
  const filteredMensual = useMemo(() => filterByRange(varMensualData), [varMensualData, timeRange]);
  const filteredYoY = useMemo(() => filterByRange(varYoYData), [varYoYData, timeRange]);

  const latestVarVal = RAW.nivelGeneral.varMensual[RAW.nivelGeneral.varMensual.length - 1];
  const latestYoYVal = RAW.nivelGeneral.varInteranual[RAW.nivelGeneral.varInteranual.length - 1];
  const nucleoVal = RAW.categorias["Núcleo"].varMensual[RAW.categorias["Núcleo"].varMensual.length - 1];
  const anualizada = ((Math.pow(1 + latestVarVal/100, 12) - 1) * 100);
  const proxyVarAcum = intrames?.variacion_acumulada_mes ?? proxy?.index?.variacion_periodo;

  const divData = RV_DIVISIONES.map((d, i) => ({
    ...d, color: DIV_COLORS[i % DIV_COLORS.length],
    lastVar: d.varMensual[d.varMensual.length - 1],
    prevVar: d.varMensual[d.varMensual.length - 2],
  })).sort((a, b) => b.lastVar - a.lastVar);

  const tooltipStyle = { backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontFamily: MONO, color: C.text };

  const selDivObj = selDiv != null ? RV_DIVISIONES[selDiv] : null;
  const selDivChart = useMemo(() => {
    if (!selDivObj) return [];
    const last24 = RAW.datesVar.slice(-24).map((date, i) => {
      const idx = RAW.datesVar.length - 24 + i;
      return { label: monthLabel(date), var: selDivObj.varMensual[idx], isProxy: false };
    });
    if (proxyStatus === "ok" && proxy?.index?.variacion_periodo != null) {
      last24.push({ label: "Mar 26 R&V", var: proxy.index.variacion_periodo, isProxy: true });
    }
    return last24;
  }, [selDiv, selDivObj, proxy, proxyStatus]);

  // Intrames chart data
  const intramesChartData = useMemo(() => {
    if (!intrames?.serie_diaria) return [];
    return intrames.serie_diaria.map(d => ({
      fecha: d.fecha,
      label: dayLabel(d.fecha),
      var_acumulada: d.var_acumulada,
    }));
  }, [intrames]);

  // Intrames division bars
  const intramesDivData = useMemo(() => {
    if (!intrames?.variaciones_por_division) return [];
    return Object.entries(intrames.variaciones_por_division)
      .filter(([_, v]) => v.tiene_datos && v.variacion_acumulada != null)
      .map(([cod, v], i) => ({
        codigo: cod,
        nombre: v.nombre,
        variacion: v.variacion_acumulada,
        peso: v.peso_ajustado,
        color: DIV_COLORS[i % DIV_COLORS.length],
      }))
      .sort((a, b) => b.variacion - a.variacion);
  }, [intrames]);

  const currentMonth = new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  return (
    <div style={{ fontFamily: FONT, background: C.bg, color: C.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      <header style={{ padding: "20px 28px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontFamily: MONO, color: C.teal, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 2 }}>R&V IPC · Base dic 2016=100</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Inflación Argentina</h1>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: MONO, marginTop: 2 }}>Serie INDEC ene 2017 – feb 2026 + Proxy R&V en vivo</div>
        </div>
        <div style={{ display: "flex", gap: 3, background: C.card, borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
          {[["overview","Panel"],["intrames","En vivo"],["divisiones","Divisiones R&V"],["categorias","Categorías"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab===k ? (k==="intrames" ? "rgba(91,156,246,0.15)" : C.tealBg) : "transparent",
              color: tab===k ? (k==="intrames" ? C.blue : C.teal) : C.muted,
              border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 11, fontFamily: MONO,
              fontWeight: 600, cursor: "pointer", letterSpacing: 0.3
            }}>{l}{k==="intrames" && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: intramesStatus==="ok" ? C.teal : C.amber, marginLeft: 6, animation: intramesStatus==="ok" ? "none" : "pulse 2s infinite" }} />}</button>
          ))}
        </div>
      </header>

      <div style={{ padding: "20px 28px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ── TOP 5 METRICS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 12 }}>
          <MetricBox label="Nivel general INDEC" value={fmtIdx(RAW.nivelGeneral.indices[RAW.nivelGeneral.indices.length-1])} sub="Feb 2026" accent />
          <MetricBox label="Var. mensual INDEC" value={`+${fmt(latestVarVal)}%`} sub="Feb 2026 vs ene 2026" />
          <MetricBox label="Acumulada mes R&V" value={proxyVarAcum != null ? `+${fmt(proxyVarAcum)}%` : "—"} sub={intrames?.mes ? `${currentMonth} (${intrames.n_dias || 0} días)` : "Conectando..."} highlight />
          <MetricBox label="Var. interanual" value={`+${fmt(latestYoYVal)}%`} sub="Feb 2026 vs feb 2025" />
          <MetricBox label="Inflación núcleo" value={`+${fmt(nucleoVal)}%`} sub="Excl. estacionales y regulados" nucleoStyle />
        </div>

        {/* ── R&V PROXY PANEL ── */}
        <div style={{ background: C.card, border: `1px solid ${proxyStatus==="ok" ? C.tealBorder : C.border}`, borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontFamily: MONO, color: C.teal, letterSpacing: 1.5, textTransform: "uppercase" }}>R&V IPC PROXY — EN VIVO</span>
              <span style={{ fontSize: 9, fontFamily: MONO, padding: "2px 8px", borderRadius: 4,
                background: proxyStatus==="ok" ? "rgba(67,217,173,0.15)" : proxyStatus==="loading" ? "rgba(240,180,41,0.15)" : "rgba(239,100,97,0.15)",
                color: proxyStatus==="ok" ? C.teal : proxyStatus==="loading" ? C.amber : C.red,
              }}>{proxyStatus==="ok" ? "CONECTADO" : proxyStatus==="loading" ? "CONECTANDO..." : "OFFLINE"}</span>
            </div>
            <button onClick={refreshProxy} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 10, fontFamily: MONO, padding: "4px 12px", cursor: "pointer" }}>Actualizar</button>
          </div>
          {proxyStatus==="ok" && proxy?.index ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <ProxyCard label="Nivel General Proxy" value={proxy.index.nivel_general?.toLocaleString("es-AR")||"—"} sub={proxy.index.fecha} accent />
              <ProxyCard label="Precios mes actual" value={monthStatus?.n_precios_totales || proxy.index.n_precios_recolectados || "0"} sub={`${monthStatus?.n_dias_recoleccion || 0} días recolectados`} />
              <ProxyCard label="Divisiones con datos" value={intrames?.divisiones_con_datos || proxy.index.divisiones_con_datos || "0"} sub="de 10 activas" />
              <ProxyCard label="Inflación anualizada" value={`${fmt(intrames?.inflacion_anualizada_estimada ?? anualizada)}%`} sub="proyección 12 meses" />
            </div>
          ) : proxyStatus==="loading" ? (
            <div style={{ fontSize: 12, color: C.muted, fontFamily: MONO, textAlign: "center", padding: 16 }}>Conectando con R&V backend...</div>
          ) : (
            <div style={{ fontSize: 12, color: C.dim, fontFamily: MONO, textAlign: "center", padding: 16 }}>Backend no disponible — mostrando datos INDEC históricos.</div>
          )}
        </div>

        {/* ── TAB: EN VIVO (INTRAMES) ── */}
        {tab === "intrames" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 13, fontFamily: MONO, color: C.blue, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Inflación en tiempo real — {currentMonth}</span>
                <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, marginTop: 2 }}>
                  Variación acumulada de precios desde el primer día del mes
                </div>
              </div>
              <button onClick={refreshIntrames} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 10, fontFamily: MONO, padding: "4px 12px", cursor: "pointer" }}>Actualizar</button>
            </div>

            {intramesStatus === "ok" && intrames ? (
              <>
                {/* Big number */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "rgba(91,156,246,0.08)", border: `1px solid rgba(91,156,246,0.25)`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>Inflación acumulada mes</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.blue, lineHeight: 1.1, fontFamily: FONT }}>{intrames.variacion_acumulada_mes >= 0 ? "+" : ""}{fmt(intrames.variacion_acumulada_mes)}%</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>{intrames.fecha_inicio} → {intrames.fecha_fin}</div>
                  </div>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>Días recolectados</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1.1, fontFamily: FONT }}>{intrames.n_dias}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>{intrames.mes}</div>
                  </div>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>Cobertura</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1.1, fontFamily: FONT }}>{fmt(intrames.cobertura_pct, 0)}%</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>{intrames.divisiones_con_datos} divisiones</div>
                  </div>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>Anualizada estimada</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: intrames.inflacion_anualizada_estimada > 40 ? C.red : C.teal, lineHeight: 1.1, fontFamily: FONT }}>{fmt(intrames.inflacion_anualizada_estimada)}%</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>proyección 12 meses</div>
                  </div>
                </div>

                {/* Daily evolution chart */}
                {intramesChartData.length > 1 ? (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0", marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginLeft: 16, marginBottom: 10 }}>Evolución diaria — Variación acumulada (%)</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={intramesChartData} margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
                        <defs>
                          <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={C.blue} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={C.blue} stopOpacity={0.02}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={v => [`${fmt(v, 3)}%`, "Var. acumulada"]} labelFormatter={l => `Día ${l}`} />
                        <ReferenceLine y={0} stroke={C.dim} strokeDasharray="2 2" />
                        <Area type="monotone" dataKey="var_acumulada" stroke={C.blue} strokeWidth={2.5} fill="url(#gradBlue)" dot={{ fill: C.blue, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: C.blue, stroke: C.bg, strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 30, textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 14, color: C.muted, marginBottom: 6 }}>Esperando más datos...</div>
                    <div style={{ fontSize: 11, color: C.dim, fontFamily: MONO }}>
                      {intrames.mensaje || "Se necesitan al menos 2 días con precios para graficar la evolución. El cron diario suma datos automáticamente."}
                    </div>
                  </div>
                )}

                {/* Division breakdown */}
                {intramesDivData.length > 0 && (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Variación por división — Acumulada {currentMonth}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {intramesDivData.map((d, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 11, color: C.muted, fontFamily: MONO, width: 150, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.nombre}</span>
                          <div style={{ flex: 1, height: 16, background: C.bg, borderRadius: 3, overflow: "hidden", position: "relative" }}>
                            <div style={{
                              height: "100%",
                              width: `${Math.min(100,Math.max(2,Math.abs(d.variacion)/5*100))}%`,
                              background: d.variacion >= 0 ? C.blue : C.teal,
                              borderRadius: 3, opacity: 0.7,
                              marginLeft: d.variacion < 0 ? "auto" : 0,
                            }} />
                          </div>
                          <span style={{ fontSize: 12, fontFamily: MONO, color: d.variacion > 0 ? C.red : d.variacion < 0 ? C.teal : C.muted, fontWeight: 600, width: 60, textAlign: "right" }}>{d.variacion>0?"+":""}{fmt(d.variacion)}%</span>
                          <span style={{ fontSize: 9, fontFamily: MONO, color: C.dim, width: 36, textAlign: "right" }}>{fmt(d.peso,1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : intramesStatus === "loading" ? (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 14, color: C.muted }}>Cargando datos intra-mensuales...</div>
              </div>
            ) : (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 16, color: C.muted, marginBottom: 8 }}>Sin datos intra-mensuales aún</div>
                <div style={{ fontSize: 11, color: C.dim, fontFamily: MONO, maxWidth: 500, margin: "0 auto" }}>
                  El sistema está recolectando precios diariamente. En 2-3 días vas a ver la curva de evolución de precios del mes en curso. El cron corre todos los días a las 8am ART.
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TAB: OVERVIEW ── */}
        {tab === "overview" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Variaciones históricas</span>
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginLeft: 16, marginBottom: 8 }}>Variación mensual (%)</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={filteredMensual} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} interval={Math.max(1,Math.floor(filteredMensual.length/12))} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`${fmt(v)}%`, "Var. mensual"]} />
                  <ReferenceLine y={0} stroke={C.dim} strokeDasharray="2 2" />
                  <Bar dataKey="varMensual" radius={[2,2,0,0]} fill={C.teal} fillOpacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginLeft: 16, marginBottom: 8 }}>Variación interanual (%)</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={filteredYoY} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} interval={Math.max(1,Math.floor(filteredYoY.length/12))} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`${fmt(v)}%`, "Var. i.a."]} />
                  <Bar dataKey="varYoY" radius={[2,2,0,0]} fill={C.red} fillOpacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Divisiones COICOP — Var. mensual feb 2026</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {divData.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: C.muted, fontFamily: MONO, width: 150, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.short}</span>
                    <div style={{ flex: 1, height: 16, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100,Math.max(2,(d.lastVar/8)*100))}%`, background: d.color, borderRadius: 3, opacity: 0.7 }} />
                    </div>
                    <span style={{ fontSize: 12, fontFamily: MONO, color: d.lastVar > latestVarVal ? C.red : C.teal, fontWeight: 600, width: 52, textAlign: "right" }}>{d.lastVar>0?"+":""}{fmt(d.lastVar)}%</span>
                    <span style={{ fontSize: 9, fontFamily: MONO, color: C.dim, width: 36, textAlign: "right" }}>{fmt(d.peso,1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── TAB: DIVISIONES R&V ── */}
        {tab === "divisiones" && (
          <>
            <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
              Divisiones medidas por R&V — Seleccioná una para ver evolución
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 8, marginBottom: 16 }}>
              {RV_DIVISIONES.map((d, i) => (
                <button key={i} onClick={() => setSelDiv(selDiv===i ? null : i)} style={{
                  background: selDiv===i ? DIV_COLORS[i%DIV_COLORS.length]+"18" : C.card,
                  border: `1px solid ${selDiv===i ? DIV_COLORS[i%DIV_COLORS.length]+"50" : C.border}`,
                  borderRadius: 8, padding: "10px 12px", cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: selDiv===i ? DIV_COLORS[i%DIV_COLORS.length] : C.text, marginBottom: 3 }}>{d.short}</div>
                  <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted }}>Peso: {fmt(d.peso,1)}%</div>
                  <div style={{ fontSize: 14, fontFamily: MONO, fontWeight: 600, color: d.varMensual[d.varMensual.length-1] > latestVarVal ? C.red : C.teal, marginTop: 2 }}>
                    +{fmt(d.varMensual[d.varMensual.length-1])}%
                  </div>
                </button>
              ))}
            </div>
            {selDivObj && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: 16, marginRight: 16, marginBottom: 4 }}>
                  <div>
                    <span style={{ fontSize: 13, fontFamily: MONO, fontWeight: 600, color: DIV_COLORS[selDiv%DIV_COLORS.length] }}>{selDivObj.nombre}</span>
                    <span style={{ fontSize: 10, fontFamily: MONO, color: C.muted, marginLeft: 10 }}>Peso: {fmt(selDivObj.peso,1)}%</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 10, fontFamily: MONO }}>
                    <span style={{ color: C.teal }}>■ INDEC</span>
                    <span style={{ color: C.orange }}>■ R&V Proxy</span>
                  </div>
                </div>
                <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, marginLeft: 16, marginBottom: 10 }}>Variación mensual (%) — últimos 24 meses + estimación R&V</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={selDivChart} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                    <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 7, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v, n, props) => {
                      const src = props.payload.isProxy ? "R&V Proxy" : "INDEC";
                      return [`${fmt(v)}%`, `${selDivObj.short} (${src})`];
                    }} />
                    <ReferenceLine y={0} stroke={C.dim} strokeDasharray="2 2" />
                    <Bar dataKey="var" radius={[2,2,0,0]}>
                      {selDivChart.map((entry, idx) => (
                        <Cell key={idx} fill={entry.isProxy ? C.orange : DIV_COLORS[selDiv%DIV_COLORS.length]} fillOpacity={entry.isProxy ? 1 : 0.7} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: MONO }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.borderLt}` }}>
                    {["División R&V","Peso","Var. mensual","Mes anterior","Tendencia"].map(h => (
                      <th key={h} style={{ textAlign: h.includes("División")?"left":"right", padding: "10px 12px", color: C.dim, fontWeight: 500, fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {divData.map((d, i) => {
                    const trend = d.lastVar - d.prevVar;
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "8px 12px", color: C.text }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: d.color, marginRight: 8 }} />{d.short}</td>
                        <td style={{ textAlign: "right", padding: "8px 12px", color: C.muted }}>{fmt(d.peso,1)}%</td>
                        <td style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, color: d.lastVar > latestVarVal ? C.red : C.teal }}>+{fmt(d.lastVar)}%</td>
                        <td style={{ textAlign: "right", padding: "8px 12px", color: C.muted }}>+{fmt(d.prevVar)}%</td>
                        <td style={{ textAlign: "right", padding: "8px 12px", color: trend>0 ? C.red : trend<0 ? C.teal : C.muted, fontSize: 10 }}>
                          {trend>0?"▲":trend<0?"▼":"─"} {fmt(Math.abs(trend))} pp
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── TAB: CATEGORIAS ── */}
        {tab === "categorias" && (
          <>
            <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Categorías IPC — Núcleo · Estacional · Regulados</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              {[["Núcleo", C.teal, nucleoVal], ["Estacional", C.amber, -1.3], ["Regulados", C.purple, 4.3]].map(([name, color, last]) => (
                <div key={name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color, marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: MONO, color: C.text }}>{last>=0?"+":""}{fmt(last)}%</div>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: MONO }}>mensual feb 2026</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 8px 8px 0" }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginLeft: 16, marginBottom: 10 }}>Inflación núcleo — Var. mensual últimos 24 meses</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={RAW.datesVar.slice(-24).map((date, i) => {
                  const idx = RAW.datesVar.length - 24 + i;
                  return { label: monthLabel(date), nucleo: RAW.categorias["Núcleo"].varMensual[idx] };
                })} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: C.dim, fontFamily: MONO }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`${fmt(v)}%`, "Núcleo"]} />
                  <Bar dataKey="nucleo" radius={[2,2,0,0]} fill={C.teal} fillOpacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 20, padding: "14px 0", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "center", fontSize: 10, fontFamily: MONO, color: C.dim }}>
          <span>R&V IPC · Fuente: INDEC Metodología N°32 + Precios Claros / ArgentinaDatos · IPC base dic 2016=100</span>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, sub, accent, delta, highlight, nucleoStyle }) {
  const bg = accent ? C.tealBg : highlight ? "rgba(91,156,246,0.08)" : nucleoStyle ? "rgba(167,139,250,0.08)" : C.card;
  const borderColor = accent ? C.tealBorder : highlight ? "rgba(91,156,246,0.25)" : nucleoStyle ? "rgba(167,139,250,0.25)" : C.border;
  const valColor = accent ? C.teal : highlight ? C.blue : nucleoStyle ? C.purple : C.text;
  return (
    <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 9, fontFamily: MONO, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: valColor, lineHeight: 1.1, fontFamily: FONT }}>
        {value}
        {delta != null && <span style={{ fontSize: 10, fontFamily: MONO, marginLeft: 6, color: delta>0?C.red:C.teal }}>{delta>0?"▲":"▼"}{Math.abs(delta).toFixed(1)}pp</span>}
      </div>
      {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: MONO }}>{sub}</div>}
    </div>
  );
}

function ProxyCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: C.bg, borderRadius: 6, padding: "10px 12px" }}>
      <div style={{ fontSize: 9, fontFamily: MONO, color: C.dim }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: accent ? C.teal : C.text, fontFamily: MONO }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: C.muted, fontFamily: MONO }}>{sub}</div>}
    </div>
  );
}
