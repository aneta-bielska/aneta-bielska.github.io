---
layout: post
title:  "Css: absolute power!"
date:   2016-05-07 19:30:23 +0100
categories: blog
tags:
- css
image:
  feature: empty-large.png
  teaser: empty-small.png
---

<style type="text/css">
  .css-position {
    padding: 10px;
  }
</style>

Css `position` property is powerful and it allows to create great layouts.
But setting position of css elements can often be very confusing.
In this post I will be writing about static, absolute and relative positions of page elements.

By default page elements have static position.

### Static

Static positioned elements are not affected by the top, bottom, left, and right properties.
All elements follow normal page position flow.

Elements with css default static position:

<div class="css-position" style="color: White; background: Maroon;">
  I am static
  <div class="css-position" style="color: White; background: Crimson"> I am static, too</div>
</div>

<br />

```html
<div class="css-position" style="color: White; background: Maroon">
  I am static
  <div class="css-position" style="background: Crimson">I am static, too</div>
</div>
```

### Absolute

When we add absolute position the element become independent from the rest of the context.
At the same time it doesn't affect other elements of the page.

If an absolute positioned element has no positioned ancestors, it uses the document body, and moves along with page scrolling.

Element with css absolute position:

<div class="css-position" style="color: White; background: Maroon;padding-top: 60px">
  I am static, and my inner div is gone!
  <div class="css-position"
       style="color: White;
              background: Crimson;
              position: absolute;
              top: 1000px;
              left: 400px;">
    Absolute power!
  </div>
</div>

<br />

```html
<div style="color: White; background: Maroon;padding-top: 60px">
  I am static, and my inner div is gone!
  <div style="color: White;
              background: Crimson;
              position: absolute;
              top: 1000px;
              left: 400px;">
    Absolute power!
  </div>
</div>
```

### Absolute + Relative

To change context of absolute element we need to add relative posiotion to its ancestor.

Element with css absolute position + relative ancestor:

<div class="css-position"
     style="color: White;
            background: Maroon;
            position: relative;
            padding-top: 60px">
  I am relative and I am a context to my inner absolute div!
  <div class="css-position"
       style="color: White; background: Crimson; position: absolute; top: 0; left: 0;">Absolute power!</div>
</div>

<br />

```html
<div style="color: White;
            background: Maroon;
            position: relative;
            padding-top: 60px">
  I am relative and I am a context to my inner absolute div!
  <div style="color: White;
              background: Crimson;
              position: absolute;
              top: 0;
              left: 0">
    Absolute power!
  </div>
</div>
```


### Relative

Setting relative position on its own give us possibility to set top/right/bottom/left properties.
It adjust position of the element in current context.

Element with css relative position:

<div class="css-position" style="color: White; background: Maroon;">
  I am static
  <div class="css-position" style="color: White; background: Crimson; position: relative;
              left: 60px"> I am relative</div>
</div>

<br />

```html
<div class="css-position" style="color: White; background: Maroon">
  I am static
  <div class="css-position"
       style="background: Crimson;
              position: relative;
              left: 60px;">
    I am relative
  </div>
</div>
```

