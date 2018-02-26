const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

commentSchema.methods.isOwnedBy = function(user) {
  return this.user && user._id.equals(this.user._id);
};

const schema = new mongoose.Schema({
  danceClass: { type: String, required: true, minlength: 2 },
  studio: { type: String, required: true, minlength: 2 },
  content: { type: String, required: true, minlength: 30 },
  image: { type: String, pattern: /^https?\/\/.+/},
  comments: [ commentSchema ],
  category: { type: mongoose.Schema.ObjectId, ref: 'Category', required: true }
});

schema
  .virtual('avgRating')
  .get(function getAvgRating() {
    if(this.comments.length === 0) return 'N/A';
    const ratings = this.comments.map(comment => comment.rating);
    return Math.round(((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 2) / 2);
  });

module.exports = mongoose.model('Dance', schema);
