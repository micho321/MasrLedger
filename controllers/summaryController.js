const Transaction = require('../models/Transaction');

// @desc    Get monthly summary
// @route   GET /api/summary/monthly
// @access  Private
exports.getMonthlySummary = async (req, res, next) => {
    try {
        const { month, year } = req.query;

        // Default to current month/year if not provided
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        // Calculate start and end dates for the month
        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

        // Aggregate transactions
        const summary = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Process results
        let totalIncome = 0;
        let totalExpense = 0;
        let incomeCount = 0;
        let expenseCount = 0;

        summary.forEach((item) => {
            if (item._id === 'income') {
                totalIncome = item.total;
                incomeCount = item.count;
            } else if (item._id === 'expense') {
                totalExpense = item.total;
                expenseCount = item.count;
            }
        });

        const netIncome = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            data: {
                period: {
                    month: targetMonth + 1,
                    year: targetYear,
                    startDate,
                    endDate,
                },
                summary: {
                    totalIncome,
                    totalExpense,
                    netIncome,
                    incomeTransactions: incomeCount,
                    expenseTransactions: expenseCount,
                    totalTransactions: incomeCount + expenseCount,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get tax estimate
// @route   GET /api/summary/tax
// @access  Private
exports.getTaxEstimate = async (req, res, next) => {
    try {
        const { month, year } = req.query;

        // Default to current month/year if not provided
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        // Calculate start and end dates for the month
        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

        // Get total income for the period
        const incomeResult = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: 'income',
                    date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$amount' },
                },
            },
        ]);

        const totalIncome = incomeResult.length > 0 ? incomeResult[0].totalIncome : 0;

        // Simple tax calculation for Egyptian freelancers
        // This is a simplified estimate - actual tax rates vary
        let taxRate = 0;
        let estimatedTax = 0;

        if (totalIncome <= 15000) {
            taxRate = 0; // Tax-free bracket
        } else if (totalIncome <= 30000) {
            taxRate = 2.5;
            estimatedTax = (totalIncome - 15000) * 0.025;
        } else if (totalIncome <= 45000) {
            taxRate = 10;
            estimatedTax = 15000 * 0.025 + (totalIncome - 30000) * 0.10;
        } else if (totalIncome <= 60000) {
            taxRate = 15;
            estimatedTax = 15000 * 0.025 + 15000 * 0.10 + (totalIncome - 45000) * 0.15;
        } else {
            taxRate = 22.5;
            estimatedTax = 15000 * 0.025 + 15000 * 0.10 + 15000 * 0.15 + (totalIncome - 60000) * 0.225;
        }

        const netIncomeAfterTax = totalIncome - estimatedTax;

        res.status(200).json({
            success: true,
            data: {
                period: {
                    month: targetMonth + 1,
                    year: targetYear,
                },
                taxEstimate: {
                    totalIncome,
                    estimatedTax: Math.round(estimatedTax * 100) / 100,
                    effectiveTaxRate: totalIncome > 0 ? Math.round((estimatedTax / totalIncome) * 10000) / 100 : 0,
                    netIncomeAfterTax: Math.round(netIncomeAfterTax * 100) / 100,
                    taxBracket: `${taxRate}%`,
                },
                disclaimer: 'This is a simplified estimate. Consult with an accountant for accurate tax calculations.',
            },
        });
    } catch (error) {
        next(error);
    }
};
