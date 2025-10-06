const express = require('express');
const Case = require('../models/Case');

const router = express.Router();

// Search cases
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

    let query = {};
    
    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Filters
    if (jurisdiction && jurisdiction !== 'all') {
      query.jurisdiction = new RegExp(jurisdiction, 'i');
    }
    
    if (caseType && caseType !== 'all') {
      query.caseType = new RegExp(caseType.replace('-', ' '), 'i');
    }

    if (court && court !== 'all') {
      query.court = new RegExp(court, 'i');
    }

    // Date range
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // Sort options
    let sortOption = { date: -1 }; // Default: newest first
    if (sort === 'relevance' && q) {
      sortOption = { score: { $meta: 'textScore' }, date: -1 };
    } else if (sort === 'oldest') {
      sortOption = { date: 1 };
    }

    const cases = await Case.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-fullText'); // Exclude full text for search results

    const total = await Case.countDocuments(query);

    res.json({
      cases,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Search cases error:', error);
    res.status(500).json({ message: 'Error searching cases' });
  }
});

// Get single case
router.get('/:id', async (req, res) => {
  try {
    const case_doc = await Case.findById(req.params.id);
    
    if (!case_doc) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(case_doc);
  } catch (error) {
    console.error('Get case error:', error);
    res.status(500).json({ message: 'Error retrieving case' });
  }
});

// Get case statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();
    
    const casesByType = await Case.aggregate([
      { $group: { _id: '$caseType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const casesByJurisdiction = await Case.aggregate([
      { $group: { _id: '$jurisdiction', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentCases = await Case.find()
      .sort({ date: -1 })
      .limit(5)
      .select('title citation date court');

    res.json({
      totalCases,
      casesByType,
      casesByJurisdiction,
      recentCases
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error retrieving case statistics' });
  }
});

module.exports = router;