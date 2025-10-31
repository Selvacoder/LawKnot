const express = require('express');
const Case = require('../models/Case');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const {
      q,
      jurisdiction,
      caseType,
      court,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = 'relevance'
    } = req.query;

    const query = {};

    // ✅ Smart flexible search
    if (q && q.trim() !== '') {
      const keyword = q.trim();

      // First try text search if index exists
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { summary: { $regex: keyword, $options: 'i' } },
        { keyPoints: { $regex: keyword, $options: 'i' } },
        { caseType: { $regex: keyword, $options: 'i' } },
        { court: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ];
    }

    // ✅ Filters
    if (jurisdiction && jurisdiction.toLowerCase() !== 'all') {
      query.jurisdiction = { $regex: jurisdiction, $options: 'i' };
    }

    if (caseType && caseType.toLowerCase() !== 'all') {
      query.caseType = { $regex: caseType.replace('-', ' '), $options: 'i' };
    }

    if (court && court.toLowerCase() !== 'all') {
      query.court = { $regex: court, $options: 'i' };
    }

    // ✅ Date filters
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // ✅ Sorting options
    let sortOption = { date: -1 };
    if (sort === 'oldest') sortOption = { date: 1 };

    // ✅ Query execution
    const cases = await Case.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('-fullText'); // exclude heavy field

    const total = await Case.countDocuments(query);

    res.json({
      cases,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching cases', error: error.message });
  }
});


module.exports = router;
