// backend/src/utils/geo.js

const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const getBoundingBox = (lat, lng, radiusKm) => {
    const latDelta = radiusKm / 111
    const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180))
    return {
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
        minLng: lng - lngDelta,
        maxLng: lng + lngDelta
    }
}

export { getDistance, getBoundingBox }


// const getNearbyStores = async (customerLat, customerLng, radiusKm = 10) => {

//   const stores = await prisma.$queryRaw`
//     SELECT 
//       *,
//       (
//         6371 * acos(
//           cos(radians(${customerLat})) * 
//           cos(radians(latitude)) * 
//           cos(radians(longitude) - radians(${customerLng})) + 
//           sin(radians(${customerLat})) * 
//           sin(radians(latitude))
//         )
//       ) AS distance_km
//     FROM stores
//     WHERE status = 'OPEN'
//     AND partner_status = 'APPROVED'
//     HAVING distance_km < ${radiusKm}
//     ORDER BY distance_km ASC
//   `

//   return stores
// }

// POST /api/location
// const setCustomerLocation = async (req, res) => {
//   const { lat, lng } = req.body
//   const userId = req.user.id

//   // Find nearby store IDs once
//   const nearbyStores = await prisma.$queryRaw`
//     SELECT id FROM stores
//     WHERE status = 'OPEN'
//     AND partner_status = 'APPROVED'
//     AND (
//       6371 * acos(
//         cos(radians(${lat})) * cos(radians(latitude)) *
//         cos(radians(longitude) - radians(${lng})) +
//         sin(radians(${lat})) * sin(radians(latitude))
//       )
//     ) < service_radius_km
//     ORDER BY id
//   `

//   const storeIds = nearbyStores.map(s => s.id)

//   // Cache in Redis for 10 minutes
//   await redis.setex(
//     `nearby_stores:${userId}`,
//     600,
//     JSON.stringify(storeIds)
//   )

//   res.json({ storeIds })
// }