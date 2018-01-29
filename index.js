var osmosis = require('osmosis');

let reviewAgg = [];

let exclamationWeight = 300;

osmosis
  .get('https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For-The-People-dealer-reviews-23685/#link')
  .paginate('.sliding_pagination .next a', 4)
  .find('#reviews .review-entry')
  .set({
    body: '.review-content',
    rating: '.dealership-rating > .rating-static@class',
    name: '.italic.font-18.black.notranslate'
  })
  .data(function(page) {
    page.rating = Number(page.rating.split('rating-')[2].split(' ')[0]) // TODO: VERY BRITTLE - do with regex
    reviewAgg.push(page);
  })
  .done(() => {
    let reviews = reviewAgg.filter(rev => rev.rating === 50);
    reviews = reviews.map((review) => {
      review.exclamationCount = (review.body.match(/!/g) || []).length
      review.bodyLength = review.body.length
      review.score = review.bodyLength + (review.exclamationCount * exclamationWeight) 
      review.name = review.name.split('- ')[1]
      return review
    });

    reviews.sort((a, b) => {
      if (a.score > b.score) return -1
      if (b.score > a.score) return 1
      return 0
    });
    console.log(reviews.slice(0, 3))
  })
