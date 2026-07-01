import prisma from "../../lib/prisma.js";
import { asynHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from '../../utils/apiResponse.js'
import { BadRequestError, ForbiddenError, NotFoundError, InternalServerError, ValidationError } from "../../utils/errors.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.js";
import {slugify} from '../../utils/helper.js'
const WEEKDAY_KEYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const normalizeDay = (day) => {
    if (typeof day === 'number' && Number.isInteger(day) && day >= 0 && day <= 6) {
        return WEEKDAY_KEYS[day];
    }

    const value = String(day ?? '').trim().toUpperCase();

    if (/^[0-6]$/.test(value)) {
        return WEEKDAY_KEYS[Number(value)];
    }

    const aliases = {
        SUNDAY: 'SUN',
        SUN: 'SUN',
        MONDAY: 'MON',
        MON: 'MON',
        TUESDAY: 'TUE',
        TUE: 'TUE',
        WEDNESDAY: 'WED',
        WED: 'WED',
        THURSDAY: 'THU',
        THU: 'THU',
        FRIDAY: 'FRI',
        FRI: 'FRI',
        SATURDAY: 'SAT',
        SAT: 'SAT',
    };

    return aliases[value] ?? null;
};

const getUniqueStoreHours = (storeHours = []) => {
    const uniqueHours = new Map();

    for (const storeHour of storeHours) {
        const day = normalizeDay(storeHour?.day);

        if (!day || uniqueHours.has(day)) {
            continue;
        }

        uniqueHours.set(day, {
            ...storeHour,
            day,
        });
    }

    return WEEKDAY_KEYS.filter((day) => uniqueHours.has(day)).map((day) => uniqueHours.get(day));
};

const getTodaysTiming = (storeHours = []) => {
    const todayKey = WEEKDAY_KEYS[new Date().getDay()];
    return getUniqueStoreHours(storeHours).find((storeHour) => storeHour.day === todayKey) ?? null;
};

export const registerStore = asynHandler(async (req, res) => {
    const { id } = req.user;
    const { name, addressLine1, city, area, latitude, longitude } = req.body;
    const slug = slugify(name);
    const store = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                store: {
                    include: {
                        owner: true
                    }
                },
                role: true,
            }
        })

        if (user.store || user.role === 'STORE_ADMIN') {
            throw new ForbiddenError('You already have a store')
        }

        await tx.user.update({
            where: { id },
            data: {
                role: "STORE_ADMIN"
            }
        })

        return await prisma.store.create({
            data: {
                ownerId: user.id,
                name,
                slug,
                email: user.email,
                area,
                city,
                addressLine1,
                latitude,
                longitude,
            }
        })
    })

    return new ApiResponse(200, store, 'Store created successfully').send(res)
})

export const updateStore = asynHandler(async (req, res) => {
    const { user } = req;
    const { name, slug, description, phone, email, area, city, latitude, longitude, serviceRadiusKm, minimumOrderAmount, freeDeliveryAbove, deliveryFee, openingTime, closingTime, workingDays } = req.body;

    const store = await prisma.$transaction(async (tx) => {
        const store = await tx.store.findUnique({
            where: { ownerId: user.id },
        })

        if (!store) {
            throw new NotFoundError('Store not found')
        }

        return await tx.store.update({
            where: { id: store.id },
            data: {
                name,
                slug,
                description,
                phone,
                email,
                area,
                city,
                latitude,
                longitude,
                serviceRadiusKm,
                minimumOrderAmount,
                freeDeliveryAbove,
                deliveryFee,
                openingTime,
                closingTime,
                workingDays,
            }

        })
    })

    return new ApiResponse(200, store, 'Store updated successfully').send(res)
})

export const getStore = asynHandler(async (req, res) => {
    const { id } = req.user;
    const store = await prisma.store.findUnique({
        where: { ownerId: id },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                }
            },
            products: {
                where: { status: 'ACTIVE' },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    images: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }

        }
    })

    if (!store) {
        throw new NotFoundError('Store not found')
    }

    return new ApiResponse(200, store, 'Store retrieved successfully').send(res)
})


export const getStoreReview = asynHandler(async (req, res) => {
    const { id } = req.user;
    const store = await prisma.store.findUnique({
        where: { ownerId: id },
        select: {
            id: true,
            partnerStatus: true,
            name: true,
            email: true,
            addressLine1: true,
            city: true,
            area: true,
            serviceRadiusKm: true,
            storeHours: {
                select: {
                    day: true,
                    closeTime: true,
                    openTime: true,
                    isClosed: true,
                    id: true
                }
            }
        }
    })

    if (!store) {
        throw new NotFoundError('Store not found')
    }

    return new ApiResponse(200, store, 'Store retrieved successfully').send(res)
})

export const toggleStoreStatus = asynHandler(async (req, res) => {
    const { id } = req.user;

    const store = await prisma.$transaction(async (tx) => {
        const store = await tx.store.findUnique({
            where: { ownerId: id },
        })

        if (!store) {
            throw new NotFoundError('Store not found')
        }

        return await tx.store.update({
            where: { id: store.id },
            data: {
                status: store.status === 'OPEN' ? 'CLOSED' : 'OPEN'
            },
            select: {
                id: true,
                name: true,
                slug: true,
                status: true,
            }

        })
    }
    )

    return new ApiResponse(200, store, 'Store status updated successfully').send(res)
})

export const updateLogo = asynHandler(async (req, res) => {
    const { id } = req.user;
    const logo = req?.file;

    if (!logo) {
        throw new BadRequestError('Logo is required')
    }

    const result = await uploadToCloudinary(logo)
    const store = await prisma.store.findUnique({
        where: { ownerId: id },
    })


    if (!store) {
        throw new NotFoundError('Store not found')
    }
    const oldLogoPublicId = store.logoPublicId;

    await prisma.store.update({
        where: { id: store.id },
        data: {
            logo: result.secure_url,
            logoPublicId: result.public_id
        }
    })

    try {
        if (oldLogoPublicId) {
            await deleteFromCloudinary(oldLogoPublicId)
        }
    } catch (error) {
        console.log('Error deleting file from storage with id :', oldLogoPublicId);
    }

    return new ApiResponse(200, null, 'Logo updated successfully').send(res)
})

export const updateBanner = asynHandler(async (req, res) => {
    const { id } = req.user;
    const banner = req?.file;

    if (!banner) {
        throw new BadRequestError('Banner is required')
    }

    const result = await uploadToCloudinary(banner)
    const store = await prisma.store.findUnique({
        where: { ownerId: id },
    })

    if (!store) {
        throw new NotFoundError('Store not found')
    }

    const oldBannerPublicId = store.bannerPublicId;

    try {
        await prisma.store.update({
            where: { id: store.id },
            data: {
                banner: result.secure_url,
                bannerPublicId: result.public_id
            }
        })


    } catch (error) {
        await deleteFromCloudinary(result.public_id)
        if (oldBannerPublicId) {
            await deleteFromCloudinary(oldBannerPublicId)
        }
        throw error
    }

    return new ApiResponse(200, null, 'Banner updated successfully').send(res)
})


export const getStoreEarnings = asynHandler(async (req, res) => {
    const { id } = req.user;

    // const store = await prisma.$queryRaw`
    //     SELECT s.id, s.name, SUM(o.subtotal) as earnings
    //     FROM "Store" s
    //     LEFT JOIN "Order" o ON s.id = o."storeId"
    //     WHERE s."ownerId" = ${id}
    //     GROUP BY s.id, s.name
    // ` 

    const earningsLast7Days = await prisma.$queryRaw`
        SELECT SUM(o.subtotal) as earnings
        FROM "Store" s
        LEFT JOIN "Order" o ON s.id = o."storeId"
        WHERE s."ownerId" = ${id} AND o."createdAt" >= NOW() - INTERVAL '7 days'
    `

    const earningsLastDay = await prisma.$queryRaw`
        SELECT SUM(o.subtotal) as earnings
        FROM "Store" s
        LEFT JOIN "Order" o ON s.id = o."storeId"
        WHERE s."ownerId" = ${id} AND o."createdAt" >= NOW() - INTERVAL '1 day'
    `

    const earningsLast30Days = await prisma.$queryRaw`
        SELECT SUM(o.subtotal) as earnings
        FROM "Store" s
        LEFT JOIN "Order" o ON s.id = o."storeId"
        WHERE s."ownerId" = ${id} AND o."createdAt" >= NOW() - INTERVAL '30 days'
    `

    const earningsByDayLast7Days = await prisma.$queryRaw`
        SELECT DATE(o."createdAt") as date, SUM
        (o.subtotal) as earnings
        FROM "Store" s
        LEFT JOIN "Order" o ON s.id = o."storeId"
        WHERE s."ownerId" = ${id} AND o."createdAt" >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(o."createdAt")
        ORDER BY DATE(o."createdAt") ASC
    `

    const earningsByMonthLast6Months = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', o."createdAt") as month, SUM
        (o.subtotal) as earnings
        FROM "Store" s
        LEFT JOIN "Order" o ON s.id = o."storeId"
        WHERE s."ownerId" = ${id} AND o."createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', o."createdAt")
        ORDER BY DATE_TRUNC('month', o."createdAt") ASC
    `

    return new ApiResponse(200, { earningsLast7Days: earningsLast7Days[0], earningsLastDay: earningsLastDay[0], earningsLast30Days: earningsLast30Days[0], earningsByDayLast7Days: earningsByDayLast7Days, earningsByMonthLast6Months: earningsByMonthLast6Months }, 'Store earnings retrieved successfully').send(res)
})

export const getStoreAnalytics = asynHandler(async (req, res) => {
    const { id } = req.user;
    const { query } = req;

    // i need total revenue by daily monthly or weekly based on query , with increase percentage from last month , revenue per category and recent orders with customer details and product details and delivery details and payment details and also i need to get total customers and new customers in last month and percentage increase from last month and also i need to get total orders and new orders in last month and percentage increase from last month

    const analytics = await prisma.$queryRaw`
        SELECT 
            (SELECT SUM(o.subtotal) FROM "Order" o WHERE o."storeId" = s.id AND o."createdAt" >= date_trunc('month', CURRENT_DATE)) as monthlyRevenue,
            (SELECT SUM(o.subtotal) FROM "Order" o WHERE o."storeId" = s.id AND o."createdAt" >= date_trunc('week', CURRENT_DATE)) as weeklyRevenue,
            (SELECT SUM(o.subtotal) FROM "Order" o WHERE o."storeId" = s.id AND o."createdAt" >= CURRENT_DATE) as dailyRevenue,
            (SELECT COUNT(DISTINCT o."customerId") FROM "Order" o WHERE o."storeId" = s.id) as totalCustomers,
            (SELECT COUNT(DISTINCT o."customerId") FROM "Order" o WHERE o."storeId" = s.id AND o."createdAt" >= date_trunc('month', CURRENT_DATE)) as newCustomers,
            (SELECT COUNT(*) FROM "Order" o WHERE o."storeId" = s.id) as totalOrders,
            (SELECT COUNT(*) FROM "Order" o WHERE o."storeId" = s.id AND o."createdAt" >= date_trunc('month', CURRENT_DATE)) as recentOrders
        FROM "Store" s
        WHERE s."ownerId" = ${id}
    `



    return new ApiResponse(200, analytics[0], 'Store analytics retrieved successfully').send(res)
})

export const getStoreLogoBanner = asynHandler(async (req, res) => {
    const { id } = req.user;

    const store = await prisma.store.findUnique({
        where: { ownerId: id },
        select: {
            id: true,
            name: true,
            logo: true,
            banner: true,
        }
    })

    if (!store) {
        throw new NotFoundError('Store not found');
    }

    return new ApiResponse(200, store, 'Store logo banner retrieved successfully').send(res)
})

export const getStoreLocation = asynHandler(async (req, res) => {
    const { id } = req.user;

    const store = await prisma.store.findUnique({
        where: { ownerId: id },
        select: {
            id: true,
            name: true,
            slug: true,
            addressLine1: true,
            area: true,
            city: true,
            latitude: true,
            longitude: true,
            serviceRadiusKm: true
        }
    })

    if (!store) {
        throw new NotFoundError('Store not found');
    }

    return new ApiResponse(200, store, 'Store location retrieved successfully').send(res)
})


export const updateStoreLocation = asynHandler(async (req, res) => {
    const { id } = req.user;
    const { addressLine1, city, area, latitude, longitude, serviceRadiusKm } = req.body

    const store = await prisma.store.findUnique({
        where: { ownerId: id },
        select: {
            id: true,
        }
    })

    if (!store || !store.id) {
        throw new NotFoundError('Store not found');
    }

    const location = await prisma.store.update({
        where: { id: store.id },
        data: {
            addressLine1,
            city,
            area,
            longitude,
            latitude,
            serviceRadiusKm,
        }
    })

    return new ApiResponse(200, location, 'Store location retrieved successfully').send(res)
})


export const getStoreTimings = asynHandler(async (req, res) => {
    const { id } = req.user;

    const store = await prisma.store.findUnique({
        where: { ownerId: id },
        select: {
            id: true,
            name: true,
            slug: true,
            openingTime: true,
            closingTime: true,
            workingDays: true,
            storeHours: {
                select: {
                    day: true,
                    openTime: true,
                    closeTime: true,
                    isClosed: true
                }
            }
        }
    })

    if (!store) {
        throw new NotFoundError('Store not found');
    }

    const storeHours = getUniqueStoreHours(store.storeHours);
    const todaysTiming = getTodaysTiming(storeHours);

    return new ApiResponse(200, {
        ...store,
        openingTime: todaysTiming?.isClosed ? null : todaysTiming?.openTime ?? store.openingTime ?? null,
        closingTime: todaysTiming?.isClosed ? null : todaysTiming?.closeTime ?? store.closingTime ?? null,
        workingDays: storeHours.filter((timing) => !timing.isClosed).map((timing) => timing.day),
        storeHours,
    }, 'Store timings retrieved successfully').send(res)

})


export const updateStoreTimings = asynHandler(async (req, res) => {
    const { id } = req.user;
    const { timings = [] } = req.body;

    if (!Array.isArray(timings) || timings.length < 1) {
        throw new ValidationError('Timings are required')
    }

    const normalizedTimings = timings.map((timing) => {
        const day = normalizeDay(timing?.day);

        if (!day) {
            throw new ValidationError(`Invalid timing day: ${timing?.day}`);
        }

        if (!timing?.isClosed && (!timing?.openTime || !timing?.closeTime)) {
            throw new ValidationError(`Open and close time are required for ${day}`);
        }

        return {
            day,
            openTime: timing?.openTime,
            closeTime: timing?.closeTime,
            isClosed: Boolean(timing?.isClosed),
        };
    });

    const duplicateDays = normalizedTimings
        .filter((timing, index, list) => list.findIndex((item) => item.day === timing.day) !== index)
        .map((timing) => timing.day);

    if (duplicateDays.length > 0) {
        throw new ValidationError(`Duplicate days are not allowed: ${[...new Set(duplicateDays)].join(', ')}`)
    }

    const todayTiming = getTodaysTiming(normalizedTimings);

    const storeTimings = await prisma.$transaction(async (tx) => {
        const store = await tx.store.findUnique({
            where: { ownerId: id },
            select: {
                id: true,
            }
        });


        if (!store || !store.id) {
            throw new NotFoundError('Store not found');
        }

        await tx.storeHour.deleteMany({
            where: { storeId: store.id }
        });

        const storeHours = await tx.storeHour.createMany({
            data: normalizedTimings.map((timing) => ({
                storeId: store.id,
                day: timing.day,
                openTime: timing.openTime,
                closeTime: timing.closeTime,
                isClosed: Boolean(timing.isClosed)
            })),
        })

        if (storeHours.count !== normalizedTimings.length) {
            throw new InternalServerError('Something went wrong while update store timings')
        }

        return await tx.store.update({
            where: { id: store.id },
            data: {
                openingTime: todayTiming?.isClosed ? null : todayTiming?.openTime ?? null,
                closingTime: todayTiming?.isClosed ? null : todayTiming?.closeTime ?? null,
                workingDays: normalizedTimings.filter((timing) => !timing.isClosed).map((timing) => timing.day)
            },
            select: {
                id: true,
                name: true,
            }
        })
    })

    console.log('storeTimings :>> ', storeTimings);

    return new ApiResponse(200, storeTimings, 'Store timings updated successfully').send(res)
})