# FAQ Structured Data (Microdata) Guide

## Table of Contents

1. [What is FAQ Structured Data?](#what-is-faq-structured-data)
2. [Why is it Important?](#why-is-it-important)
3. [Supported Formats](#supported-formats)
4. [Implementation](#implementation)
5. [Schema.org Properties](#schemaorg-properties)
6. [Validation](#validation)
7. [Examples](#examples)
8. [Testing](#testing)
9. [FAQ](#faq)

---

## What is FAQ Structured Data?

**Structured Data** (also known as Microdata or Schema markup) is a standardized format for providing information about your FAQs to search engines like Google, Bing, and others.

When you implement structured data for your FAQ page, search engines can:

- **Display your FAQs as rich results** in search listings
- **Show expandable Q&A format** directly in search results
- **Help Google Assistant and AI** understand your content better
- **Improve click-through rates** and user engagement
- **Enhance your SEO** by providing machine-readable content

---

## Why is it Important?

### Benefits of FAQ Structured Data:

1. **Rich Search Results**
   - Your FAQs can appear with expandable accordion format in Google search
   - Users can see answers directly on the search results page
   - Increases visibility and click-through rates

2. **Google Assistant Compatibility**
   - Google Assistant can directly answer user questions from your FAQs
   - Voice search devices can read your content better

3. **Better SEO**
   - Search engines understand your content more accurately
   - Improved ranking potential for FAQ-related queries
   - Higher authority in your niche

4. **User Experience**
   - Users get immediate answers without visiting your site
   - Reduces support ticket volume
   - Builds trust and credibility

---

## Supported Formats

### JSON-LD (Recommended)

This plugin implements **JSON-LD (JavaScript Object Notation for Linked Data)** format, which is Google's recommended format.

**Advantages:**
- ✅ Cleaner code implementation
- ✅ Easier to validate and debug
- ✅ Supports nested data structures
- ✅ Widely supported by search engines
- ✅ Can be injected anywhere on the page

### Microdata Attributes

For maximum compatibility, this plugin also includes **HTML Microdata** attributes directly on elements.

**Advantages:**
- ✅ Works without JavaScript
- ✅ Easier to inspect in browser dev tools
- ✅ Falls back gracefully
- ✅ Better for simple use cases

---

## Implementation

### How the Plugin Implements Structured Data

The Mos FAQs plugin automatically adds FAQ structured data to all FAQ displays:

#### Via Shortcode
When you use the `[mos_faq]` shortcode, the plugin automatically:
1. Collects all FAQ posts to be displayed
2. Generates schema.org/FAQPage markup
3. Includes both JSON-LD script and Microdata attributes
4. Wraps FAQ items with proper schema properties

#### Via Gutenberg Block
When you use the FAQ block in the Block Editor:
1. The same schema generation logic applies
2. Structured data is automatically added to the output
3. No additional configuration needed

#### Via WooCommerce Integration
When FAQs are displayed on product pages:
1. Each product's FAQs include proper structured data
2. Schema follows Google's guidelines for product FAQs
3. Automatically adapts to the FAQ display settings

### No Configuration Required

The structured data is **automatically generated** - you don't need to:
- ❌ Manually write any schema markup
- ❌ Configure any settings
- ❌ Install additional plugins
- ❌ Modify your theme

Simply use the FAQ shortcode or block as normal!

---

## Schema.org Properties

### Main Container: FAQPage

The entire FAQ container is marked as:
```html
<div itemscope itemtype="https://schema.org/FAQPage">
```

**Properties used:**
- `itemscope` - Defines the scope of structured data
- `itemtype` - Specifies the type as FAQPage from schema.org

### FAQ Item: Question

Each FAQ question is wrapped as:
```html
<div itemscope itemtype="https://schema.org/Question" itemprop="mainEntity">
```

**Properties used:**
- `@type` (in JSON-LD) / `itemtype` (in Microdata) - Defines as Question type
- `itemprop="name"` - The FAQ question/title text
- `itemprop="mainEntity"` - Links to the container

### FAQ Answer: Answer

Each FAQ answer is wrapped as:
```html
<div itemscope itemtype="https://schema.org/Answer" itemprop="acceptedAnswer">
```

**Properties used:**
- `@type` (in JSON-LD) / `itemtype` (in Microdata) - Defines as Answer type
- `itemprop="text"` - The actual answer content
- `itemprop="acceptedAnswer"` - Links to the Question

### JSON-LD Structure

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Your FAQ Question",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your FAQ Answer"
      }
    }
  ]
}
```

---

## Validation

### How to Validate Your Structured Data

1. **Google Rich Results Test**
   - Visit: https://search.google.com/test/rich-results
   - Enter your FAQ page URL
   - Check for "FAQPage" type detection
   - Review any errors or warnings

2. **Schema.org Validator**
   - Visit: https://validator.schema.org/
   - Paste your page HTML or JSON-LD
   - Verify all properties are valid
   - Check for required properties

3. **Chrome DevTools**
   - Right-click on your FAQ page
   - Select "Inspect"
   - Go to "Application" tab
   - Check for structured data under "DOM" section

### Common Issues and Fixes

#### Issue: No Structured Data Detected
**Cause:** Schema not generated or JavaScript errors
**Fix:**
- Ensure plugin is activated
- Check browser console for JavaScript errors
- Verify plugin version is 3.0.0 or higher

#### Issue: "mainEntity" Missing
**Cause:** No FAQs found on page
**Fix:**
- Ensure at least one FAQ post is published
- Check post status is "publish" not "draft"
- Verify shortcodes are properly closed

#### Issue: Content Too Long
**Cause:** Answer content exceeds Google's limits
**Fix:**
- Keep answers concise and focused
- Use excerpts for very long answers
- Ensure content is properly formatted

---

## Examples

### Example 1: Single FAQ

**Input:**
```php
[mos_faq source="recent" count="1"]
```

**Output (simplified):**
```html
<div itemscope itemtype="https://schema.org/FAQPage" class="mos-faq-container">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is this plugin?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mos FAQs is a WordPress plugin..."
        }
      }
    ]
  }
  </script>
  <div class="mos-faq-unit" itemscope itemtype="https://schema.org/Question" itemprop="mainEntity">
    <div class="mos-faq-heading">
      <h4 itemprop="name">What is this plugin?</h4>
    </div>
    <div class="mos-faq-body" itemscope itemtype="https://schema.org/Answer" itemprop="acceptedAnswer">
      <div itemprop="text">Mos FAQs is a WordPress plugin...</div>
    </div>
  </div>
</div>
```

### Example 2: Multiple FAQs

**Input:**
```php
[mos_faq source="selected_posts" posts="1,2,3"]
```

**Output:** Each FAQ item will include:
- Proper Question/Answer structure
- Both JSON-LD and Microdata
- All schema.org required properties
- SEO-optimized content

### Example 3: Categorized FAQs

**Input:**
```php
[mos_faq source="selected_categories" category="5"]
```

**Output:** All FAQs from category 5 with full schema markup.

---

## Testing

### Google Rich Results Testing

1. Create a test page with FAQs
2. Publish it on your site
3. Visit: https://search.google.com/test/rich-results
4. Enter the full URL of your FAQ page
5. Review the results

**Expected Results:**
- ✅ "FAQPage" detected
- ✅ All FAQ items recognized as Question/Answer
- ✅ No errors or warnings
- ✅ Preview shows expandable FAQ format

### Browser Testing

1. Open your FAQ page in Chrome
2. Right-click and select "Inspect"
3. Go to the "Application" tab
4. Expand "DOM" section
5. Look for structured data

**What to Look For:**
- Itemscope attributes on FAQ container
- Itemtype attributes on each element
- Itemprop attributes with proper values
- JSON-LD script with correct format

---

## FAQ

### Q: Can I disable structured data?
**A:** No, structured data is automatically generated for all FAQ displays. This is by design to ensure maximum SEO benefit.

### Q: Will structured data slow down my site?
**A:** No, the impact is minimal. The JSON-LD script is small (typically < 5KB for entire FAQ page).

### Q: Do I need to use both JSON-LD and Microdata?
**A:** We implement both for maximum compatibility. Most modern search engines prefer JSON-LD, but Microdata provides a fallback and easier inspection.

### Q: Can I customize the structured data?
**A:** Currently, the structured data is automatically generated based on your FAQ posts. Future versions may include customization options if needed.

### Q: Does this work with page builders?
**A:** Yes! Since the structured data is added via the shortcode, it works with:
- Gutenberg blocks
- Classic editor
- Elementor
- Divi
- Visual Composer
- Any other page builder that uses shortcodes

### Q: What if I have very long answers?
**A:** The plugin includes the full answer content in the structured data. For very long answers, Google may truncate them in search results, but the full content is still available on your page.

### Q: How does this compare to Ultimate FAQs plugin?
**A:** Both plugins implement FAQ structured data. Our implementation:
- Uses both JSON-LD and Microdata formats
- Follows Google's FAQPage schema guidelines
- Automatically generates schema for all FAQ displays
- Requires no additional configuration
- Works with all shortcodes and blocks

### Q: Can I see the structured data in my HTML source?
**A:** Yes! You can view the structured data by:
1. Right-clicking on your FAQ page
2. Selecting "View Page Source"
3. Looking for:
   - `<script type="application/ld+json">` tag near the top
   - `itemscope`, `itemtype`, and `itemprop` attributes on FAQ elements

### Q: Is this compatible with WooCommerce product FAQs?
**A:** Absolutely! When you add FAQs to WooCommerce products via the product FAQ tab, each product's FAQ section includes proper structured data with:
- Product-specific FAQ schema
- Proper Question/Answer structure
- All required schema properties

---

## Technical Details

### Files Involved

- `includes/Public/StructuredData.php` - Schema generation class
- `includes/Public/Shortcode.php` - Schema injection in shortcode output
- Template files - Will automatically include schema when displaying FAQs

### Performance Considerations

- Schema generation is lightweight and fast
- No database queries added (uses existing FAQ query)
- Minimal impact on page load time
- Can be cached by page caching plugins

### Security & Sanitization

The plugin implements WordPress security best practices:
- All content is properly escaped using `wp_kses_post()`
- All attributes are escaped using `esc_attr()`
- Prevents XSS attacks through structured data
- Validates and cleans all output

### Browser Support

The structured data format is supported by:
- ✅ Google (Search, Assistant)
- ✅ Bing (Search, Cortana)
- ✅ Yahoo (Search)
- ✅ Yandex (Search)
- ✅ DuckDuckGo (Search)
- ✅ Most voice assistants (Siri, Alexa, etc.)

---

## Updates and Future Plans

### Version 3.0.0+
- ✅ Initial implementation of FAQPage schema
- ✅ Both JSON-LD and Microdata support
- ✅ Automatic generation for all FAQ displays
- ✅ Works with shortcodes, blocks, and WooCommerce

### Future Enhancements (Potential)
- [ ] Schema validation in admin
- [ ] Rich result preview tool
- [ ] Custom schema options
- [ ] Breadcrumb schema support
- [ ] Organization schema integration

---

## Additional Resources

- [Schema.org FAQPage Documentation](https://schema.org/FAQPage)
- [Google Search Central - FAQ Rich Results](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Google Rich Results Test Tool](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Structured Data Testing Tool](https://developers.google.com/structured-data/testing-tool/)

---

## Support

If you encounter issues with structured data:
1. Check the FAQ section on your page
2. Validate using Google's testing tool
3. Check browser console for errors
4. Review this documentation
5. Contact support through the plugin's support channels

Remember: Proper structured data helps your FAQs rank better and reach more users!
