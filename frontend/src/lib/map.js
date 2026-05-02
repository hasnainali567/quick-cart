// // 'use client'
// // import { MapContainer, TileLayer, useMap } from 'react-leaflet'
// // import 'leaflet/dist/leaflet.css'
// // import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
// // import L from 'leaflet'
// // import { useEffect } from 'react'

// // // Fix marker icons
// // delete L.Icon.Default.prototype._getIconUrl
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
// //   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
// //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// // })

// // // Routing component (must be inside MapContainer)
// // const Routing = ({ from, to }) => {
// //   const map = useMap()

// //   useEffect(() => {
// //     if (!map || !from || !to) return

// //     const LRM = require('leaflet-routing-machine')

// //     const routingControl = L.Routing.control({
// //       waypoints: [
// //         L.latLng(from[0], from[1]),
// //         L.latLng(to[0], to[1]),
// //       ],
// //       routeWhileDragging: true,
// //       lineOptions: {
// //         styles: [{ color: '#6366f1', weight: 4 }]   // customize path color
// //       },
// //       show: true,                  // show turn-by-turn instructions
// //       addWaypoints: false,         // prevent adding extra waypoints by clicking
// //       fitSelectedRoutes: true,     // auto-zoom to fit the route
// //       router: L.Routing.osrmv1({
// //         serviceUrl: 'https://router.project-osrm.org/route/v1',  // free, no key
// //       }),
// //     }).addTo(map)

// //     return () => map.removeControl(routingControl)  // cleanup on unmount
// //   }, [map, from, to])

// //   return null
// // }

// // const Map = ({ from = [24.8607, 67.0011], to = [24.834327570224502, 67.17101904556591], zoom = 13 }) => {
// //   const center = [24.83428, 67.06209]  // default center (Karachi)

// //   return (
// //     <MapContainer
// //       center={center}
// //       zoom={zoom}
// //       style={{ height: '700px', width: '100%' }}
// //     >
// //       <TileLayer
// //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// //         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //       />
// //       {/* //from landhi to cilifton */}
// //       {from && to && <Routing from={from} to={to} />}
// //     </MapContainer>
// //   )
// // }

// // export default Map

// 'use client'

// import { Card } from '@/components/ui/card'
// import { Map, MapMarker, MapRoute, MarkerContent } from '@/components/ui/map'
// import React, { useEffect, useState } from 'react'


// const customer = [67.1708, 24.8342] // [lng, lat]
// const store = [67.1632, 24.8159]

// const MapPage = () => {

//   const mapRef = React.useRef(null)

//   // const handleFlyTo = () => {
//   //   // Access the MapLibre GL map instance via ref
//   //   mapRef.current?.flyTo({ center: [67.1632, 24.8159], zoom: 12 });
//   // };

//   const [routeCoords, setRouteCoords] = useState([store, customer])

//   useEffect(() => {
//     const fetchRoute = async () => {
//       try {
//         const url = `https://router.project-osrm.org/route/v1/driving/${store[0]},${store[1]};${customer[0]},${customer[1]}?overview=full&geometries=geojson`

//         const res = await fetch(url)
//         const data = await res.json()

//         // OSRM returns [lng, lat] — mapcn also wants [lng, lat] so no flipping needed
//         setRouteCoords(data.routes[0].geometry.coordinates)
//       } catch (err) {
//         console.error('Route fetch failed:', err)
//         // falls back to straight line silently
//       }
//     }

//     fetchRoute()
//   }, [])

//   const flyToCustomer = () => {
//     mapRef.current?.flyTo({ center: customer, zoom: 14 })
//   }

//   return (
//     <Card className='w-full h-100 bg-gray-200 flex items-center justify-center'>
//       <Map center={[67.17084213533354, 24.834222570060646]} zoom={13} ref={mapRef}>
//         <MapRoute
//           color="#3b82f6"
//           width={4}
//           opacity={0.8}
//           coordinates={routeCoords}
//         />
//         <MapMarker longitude={store[0]} latitude={store[1]}>
//           <MarkerContent>
//             <div className="bg-green-500 size-5 rounded-full border-2 border-white shadow-lg" />
//           </MarkerContent>
//         </MapMarker>

//         {/* Customer marker */}
//         <MapMarker longitude={customer[0]} latitude={customer[1]}>
//           <MarkerContent>
//             <div className="bg-red-500 size-5 rounded-full border-2 border-white shadow-lg" />
//           </MarkerContent>
//         </MapMarker>
//       </Map>
//       <button onClick={flyToCustomer}>Fly to Customer</button>
//     </Card>
//   )
// }

// export default MapPage