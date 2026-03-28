# FAQ Rating System Documentation

## Overview

The Mos FAQs plugin now includes a Disqus-like thumbs up/down voting system for FAQ posts. This allows users to rate the helpfulness of each FAQ.

## Features

- ✅ **Thumbs Up/Down Voting** - Simple, intuitive voting interface
- ✅ **IP-Based Restrictions** - One IP can vote only once per FAQ
- ✅ **Real-time Updates** - No page refresh required
- ✅ **Visual Feedback** - Shows current vote counts and user's vote
- ✅ **AJAX-Powered** - Fast, smooth voting experience
- ✅ **Responsive Design** - Works on all devices
- ✅ **Secure** - Nonce verification and sanitization

## How It Works

### 1. Voting Interface
Each FAQ displays:
- Thumbs up icon (positive vote)
- Thumbs down icon (negative vote)
- Vote counts (displaying total ups and downs)
- Visual feedback (shows user's vote)

### 2. IP Tracking
To prevent spam voting:
- User's IP address is captured
- Each IP can vote only once per FAQ
- Vote is stored in transient (expires in 30 days)
- Cross-reference between IP and post ID

### 3. Data Storage
Votes are stored as:
- `_mos_faq_thumbs_up` - Post meta for thumbs up count
- `_mos_faq_thumbs_down` - Post meta for thumbs down count
- Transient key: `mos_faq_{post_id}_{md5(ip)}` - User's vote

### 4. REST API Endpoints
Two REST API endpoints handle voting:
- **POST** `/wp-json/mos-faqs/v1/faq/vote/{post_id}` - Submit a vote
- **GET** `/wp-json/mos-faqs/v1/faq/ratings/{post_id}` - Get current ratings

## Usage

### Shortcode Integration

The rating system is automatically integrated into the `[mos_faq]` shortcode. Simply use the shortcode as usual:

```php
[mos_faq source="recent" count="10"]
```

The thumbs up/down icons will automatically appear below each FAQ question.

### Customization

You can customize the appearance via CSS:

```css
.mos-faq-rating {
    /* Main container for rating icons */
}

.mos-faq-thumbs-up {
    /* Thumbs up icon */
}

.mos-faq-thumbs-down {
    /* Thumbs down icon */
}

.mos-faq-rating-count {
    /* Vote count display */
}
```

## REST API Details

### Vote Endpoint
**Endpoint:** `POST /wp-json/mos-faqs/v1/faq/vote/{post_id}`

**Parameters:**
- `vote` (required) - 'up' or 'down'
- `_wpnonce` (required) - WordPress nonce for verification

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your rating!",
  "ratings": {
    "up": 5,
    "down": 2,
    "net": 3,
    "user_rated": true,
    "user_vote": "up"
  }
}
```

### Ratings Endpoint
**Endpoint:** `GET /wp-json/mos-faqs/v1/faq/ratings/{post_id}`

**Parameters:** None (post_id in URL)

**Response:**
```json
{
  "up": 5,
  "down": 2,
  "net": 3,
  "user_rated": true,
  "user_vote": "up"
}
```

## Security Features

### 1. IP Address Validation
- Captures real user IP (handles proxies)
- Uses multiple fallback methods
- Sanitizes input before processing

### 2. Nonce Verification
- All AJAX requests include WordPress nonce
- REST API validates nonce on every vote
- Prevents CSRF attacks

### 3. Sanitization
- All inputs sanitized using WordPress functions
- Post meta updated using `update_post_meta()`
- Transients use WordPress security

### 4. Rate Limiting
- One vote per IP per FAQ
- Transient expires after 30 days
- Prevents spam and manipulation

## JavaScript Functions

### mosFaqVote(postId, voteType)

Main function to submit a vote.

**Parameters:**
- `postId` - The FAQ post ID
- `voteType` - 'up' or 'down'

**Behavior:**
1. Shows loading state (opacity reduced)
2. Sends AJAX request to REST API
3. Updates UI with new counts
4. Highlights user's vote
5. Disables further voting for that user

## Files Modified/Created

### New Files:
1. `includes/Public/Rating.php` - Rating logic and IP tracking
2. `assets/js/public-script.js` - JavaScript voting functionality

### Modified Files:
1. `includes/Public/Shortcode.php` - Added rating UI HTML
2. `includes/API/Rest_API.php` - Added voting REST endpoints
3. `public/css/public-style.css` - Added rating styles

## Example Output

### HTML Structure:
```html
<div class="mos-faq-unit" data-post-id="123">
    <div class="mos-faq-heading">
        <h4>What is this plugin?</h4>
    </div>
    <div class="mos-faq-rating" data-post-id="123">
        <span class="mos-faq-thumbs-up" onclick="mosFaqVote(123, 'up')">
            <i class="fa fa-thumbs-up"></i>
        </span>
        <span class="mos-faq-thumbs-down" onclick="mosFaqVote(123, 'down')">
            <i class="fa fa-thumbs-down"></i>
        </span>
        <span class="mos-faq-rating-count">
            <span class="mos-faq-thumbs-up-count">5</span>
            <span class="mos-faq-thumbs-down-count">2</span>
        </span>
    </div>
</div>
```

## Troubleshooting

### Voting Not Working
1. Check that jQuery is enqueued
2. Verify JavaScript is loaded in browser console
3. Check for console errors
4. Verify REST API is accessible: `/wp-json/mos-faqs/v1/`

### Votes Not Saving
1. Check PHP error logs
2. Verify post meta is being updated
3. Check transients table in database
4. Verify IP address is captured correctly

### Votes Not Displaying
1. Check CSS is enqueued
2. Verify styles are loaded
3. Check JavaScript is loaded
4. Look for console errors

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- AJAX voting is lightweight (~1KB)
- REST API response is fast
- Transients stored in WordPress object cache
- Minimal database queries per vote
- CSS animations are hardware-accelerated

## Future Enhancements

Potential future improvements:
- [ ] Allow vote changes within time window
- [ ] Add vote history for admins
- [ ] Export vote statistics
- [ ] Add vote sorting options
- [ ] Integrate with caching plugins

## Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Verify REST API endpoints are accessible
3. Check WordPress debug.log for PHP errors
4. Ensure WordPress REST API is enabled
5. Verify no conflicts with other plugins

---

**Version:** 3.0.0+
**Last Updated:** March 29, 2026
