# Mos FAQs

**Plugin Author:** Md. Mostak Shahid

**Author URI:** http://mostak.belocal.today/

**Demo:** [Mos FAQ Demo](http://mostak.belocal.today/plugins/mos-faq/)

**Tags:** frequently asked questions, FAQ, FAQs, easy FAQ, knowledge base, simple FAQ, FAQ categories, knowledgebase, answer, answers, faq page, FAQ Plugin, help, help desk, helpdesk, questions, wordpress faq, FAQ list, FAQ accordion, custom post type with accordion, faq list, faq with accordion, jquery ui accordion, jquery-ui, shortcodes, wordpress, WordPress Plugin, Categories, widget, widgets, statistics, AJAX, responsive FAQ, responsive FAQs, responsive frequently asked questions

**Requires at least:** 4.0

**Tested up to:** 4.9.8

**Requires PHP:** 5.6

**Stable tag:** 2.0.0

**License:** GPLv3

**License URI:** http://www.gnu.org/licenses/gpl-3.0.html

## Description

Mos faqs boilerplate for WordPress You can display your every FAQ section in 3 different ways **accordion**, **collapsible**, and **block** view. Includes shortcode options for different display configurations.

#### FAQ KEY FEATURES

- Mos FAQs, with unlimited tag and category support
- Create FAQ categories and tags
- Create FAQ posts and assign categories and tags to them
- Easy design layout to style your FAQ posts
- Responsive FAQ design that looks great on all screen sizes
- For advanced user additional CSS and JS input panel for adding custom scripts
- And the most important thing it will not add any additional time on your page load time

`[mos_faq]`

Simply insert the above shortcode into any page to display your FAQs.

Mos FAQs can do more than just FAQs. If you have a help desk or knowledge base and need to pass on information to your visitors and/or users, the question/answer formatting is perfect. With the various options related to toggling, as well as the custom fields functionality, you can easily create an in-depth knowledge base and help desk.

Mos FAQs has a responsive design that makes your FAQs look good on all screen sizes and all devices. No more worrying about what your mobile FAQs might look like. All options and styling will be applied accross all devices, so you can focus on your content.

A few extra seconds could have a huge impact on your ability to engage visitors and make sales. This means that having a fast site is essential — not just for ranking well with Google, but for keeping your bottom-line profits high. So losing page speed for a plugin is a very pain full experience, by default Mos FAQs plugin fully optimized and it will not add any additonal load into your website.

#### SHORTCODE

    `[mos_faq]`

This shortcode accepts a lot attributes, the attributes controls what to display and how to display your FAQs. Discription of attributes in short is given below

- limit: (int) - number of post to show. Use 'limit'=>-1 to show all FAQs (the 'offset' parameter is ignored with a -1 value).
- offset: (int) - number of post to displace or pass over. The 'offset' parameter is ignored when 'limit'=>-1 (show all FAQs) is used.
- category (string) - category ids seperate by `,`
- tag (string) - tag ids seperate by `,`
- order (string) - Designates the ascending or descending order of the 'orderby' parameter. Defaults to 'DESC'. An array can be used for multiple order/orderby sets.
  1.  'ASC' - ascending order from lowest to highest values (1, 2, 3; a, b, c).
  2.  'DESC' - descending order from highest to lowest values (3, 2, 1; c, b, a).
- orderby (string) - Sort retrieved posts by parameter. Defaults to 'date (post_date)'. One of ID, author, title, name, type, date, modified, parent, rand, comment_count these options can be passed.
- author (int | string) - use author id or comma-separated list of IDs.
- container (string) - Whether to wrap the FAQs section, and what to wrap it with. Default 'div'.
- container_class (string) - Class that is applied to the container.
- class (string) - CSS class to use for the container of FAQs.
- view (string) - One of accordion, collapsible, and block these options can be passed.
- grid (int) - One of 1, 2, 3, 4, and 5 these options can be passed.
- pagination (int) - If necessary then use `1` if not then leave this attribute or use `0`.
- singular (int) - If necessary then use `1` if not then leave this attribute or use `0`.

## Installation

This section describes how to install the plugin and get it working.

1. Upload the 'mos-faq' folder to the `/wp-content/plugins/` directory or install via the WP admin panel
2. Activate the plugin through the 'Plugins' menu in WordPress
3. That's it.

## Frequently Asked Questions

### What does this do?

It uses the custom post type feature to create a dedicated FAQ section in your WordPress site, including categories and tags exclusive to them.

### How Do I Use It?

Try adding the shortcode [mos_faq] to whatever page you’d like to display the FAQ on.

### What are the current FAQ shortcodes?

Currently only one shortcode [mos_faq].

### How do I limit the number of posts generated by a shortcode?

You can use the limit attribute to limit the number of posts shown. For example:

    `[mos_faq limit=10]`

### How do I customize my FAQs, for example, to change the font?

Yes you can, there is a setting section under FAQs tab from there you can almost customize every pixel of you FAQs if it is not enough for you, there is a section called ** Advanced CSS, JS ** from there you can put custom css and js.

## Screenshots

## Changelog

### 2.0.0

- Visual Interface of admin panel has been updated.
- Update CSS & JS panel

### 1.0.0

- Basic version

## Potential Enhancements

- Got a bug? Something look off? Hit me up.
