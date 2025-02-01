import { Hono } from "hono";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays, addDays, startOfYear, endOfYear, addMonths } from "date-fns";

import { isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";
import { ORDER_STATUS } from "@/constant";

const app = new Hono()
    .get(
        "/",
        isAdmin,
        async (c) => {
            const startDate = startOfMonth(new Date());
            const endDate = endOfMonth(new Date());
            const startOfTheWeek = startOfWeek(new Date());
            const endOfTheWeek = endOfWeek(new Date());
            const currentYearStart = startOfYear(new Date());
            const currentYearEnd = endOfYear(new Date());
            const monthsOfYear = Array.from({ length: 12 }, (_, i) =>
                addMonths(currentYearStart, i)
            );

            const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
                addDays(startOfTheWeek, i)
            );

            const daysOfMonth = Array.from(
                { length: endDate.getDate() },
                (_, i) => new Date(startDate.getFullYear(), startDate.getMonth(), i + 1)
            );

            const [
                todayOrders,
                yesterdayOrders,
                weekOrdersData,
                weekOrderTotal,
                monthOrdersData,
                monthOrderTotal,
                yearOrdersData,
                yearOrderTotal,
                totalOrders,
                pendingOrders,
                deliveredOrders,
                returnedOrders,
                recentOrders,
            ] = await Promise.all([
                db.order.aggregate({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                    _sum: {
                        totalPrice: true,
                    },
                }),
                db.order.aggregate({
                    where: {
                        createdAt: {
                            gte: subDays(new Date(), 1),
                            lte: startDate,
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                    _sum: {
                        totalPrice: true,
                    },
                }),
                db.order.groupBy({
                    by: ["createdAt"],
                    where: {
                        createdAt: {
                            gte: startOfTheWeek,
                            lte: endOfTheWeek,
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                    _sum: {
                        totalPrice: true,
                    },
                }),
                db.order.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfTheWeek,
                            lte: endOfTheWeek,
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                    _sum: {
                        totalPrice: true,
                    },
                }),
                db.order.groupBy({
                    by: ["createdAt"],
                    where: {
                        createdAt: {
                            gte: startOfMonth(new Date()),
                            lte: endOfMonth(new Date()),
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                    _sum: {
                        totalPrice: true,
                    },
                }),
                db.order.aggregate({
                    where: {
                        createdAt: {
                            gte: startOfMonth(new Date()),
                            lte: endOfMonth(new Date()),
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                    _sum: {
                        totalPrice: true,
                    },
                }),
                db.order.groupBy({
                    by: ["createdAt"],
                    where: {
                        createdAt: {
                            gte: currentYearStart,
                            lte: currentYearEnd,
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                    _sum: {
                        totalPrice: true,
                    },
                }),
                db.order.aggregate({
                    where: {
                        createdAt: {
                            gte: currentYearStart,
                            lte: currentYearEnd,
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                    _sum: {
                        totalPrice: true,
                    }
                }),
                db.order.count({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                }),
                db.order.count({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                        status: ORDER_STATUS.Pending,
                    },
                }),
                db.order.count({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                        status: ORDER_STATUS.Delivered,
                    },
                }),
                db.order.count({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                        status: ORDER_STATUS.Cancelled,
                    },
                }),
                db.order.findMany({
                    include: {
                        orderItems: {
                            include: {
                                variant: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 5,
                }),
            ]);

            // Format weekly data
            const weekOrders = daysOfWeek.map((date) => {
                const orderCount = weekOrdersData.find(
                    (record) =>
                        new Date(record.createdAt).toDateString() === date.toDateString()
                )?._sum.totalPrice;

                const dayName = date.toLocaleString("default", { weekday: "short" });
                return { name: dayName, count: orderCount || 0 };
            });

            // Format monthly data
            const monthOrders = daysOfMonth.map((date) => {
                const orderCount = monthOrdersData.find(
                    (record) =>
                        new Date(record.createdAt).toDateString() === date.toDateString()
                )?._sum.totalPrice;

                const day = date.getDate();
                return { day, count: orderCount || 0 };
            });

            // Format yearly data
            const yearOrders = monthsOfYear.map((date) => {
                const orderCount = yearOrdersData.find(
                    (record) =>
                        new Date(record.createdAt).getMonth() === date.getMonth() &&
                        new Date(record.createdAt).getFullYear() === date.getFullYear()
                )?._sum.totalPrice;

                const monthName = date.toLocaleString("default", { month: "short" });
                return { month: monthName, count: orderCount || 0 };
            });

            return c.json({
                todayOrders: todayOrders._sum.totalPrice,
                yesterdayOrders: yesterdayOrders._sum.totalPrice,
                weekOrders,
                weekOrderTotal: weekOrderTotal._sum.totalPrice,
                monthOrders,
                monthOrderTotal: monthOrderTotal._sum.totalPrice,
                yearOrders,
                yearOrderTotal: yearOrderTotal._sum.totalPrice,
                totalOrders,
                pendingOrders,
                deliveredOrders,
                returnedOrders,
                recentOrders,
            });
        }
    );

export default app;
