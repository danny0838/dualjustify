#Dual Justify Example

A javascript lib for implementing dual-justify for paragraphs in web.


a demo url : http://danny0838.github.io/dualjustify/


## What is Dual Justify (縱橫對齊)

Dual justify (縱橫對齊）is a traditonal layout which is usedly commonly in Chinese/Japanese/Korean (a.k.a CJK).
In these languages, each character is constrained in a square, so you can easily create a layout which each single character is aligned vertically and horizontally.
In modern web, we can still create such fully aligned layout if whole paragraph is written in CJK.

Still don't understand ? check this picture http://zh.wikipedia.org/wiki/File:Inscriptions.JPG (source: wikipedia)

However, it is almost impossible to avoid English terms and numbers in modern days,
and on web if a CJK paragraph contains them, the once dual-justified layout will be broken.

This library provides a simple way to keep the alignment while still allowing non-CJK characters in a paragraph.
It simply put all the non-CJK characters (mostly single-byte chars) in a box which width can be divided by other CJK characters.

Here is what it should look like:
https://lh3.googleusercontent.com/-FfPwE7UI3kk/T5QT-d7NEgI/AAAAAAAAEmY/clhrpqbxIt8/w506-h379/oL5H.png

## How to use it on your blog (or how to messed up your site)

WARNING: You better know basic HTML/CSS for your debugging

In your blog, insert below codes:

```
<link rel="stylesheet" type="text/css" href="http://danny0838.github.io/dualjustify/justify.css" />
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript" src="http://danny0838.github.io/dualjustify/justify.js"></script>
<script>
    (function(){
        var options = {
            selector: '.dualjustify' // CSS selector for the article body's paragraph
        };
        $.dualJustify(options);
    })();
</script>
```

## Special thanks to
The original idea came from @octw
http://blog.readmoo.com/2013/12/03/why-not-use-justification-on-web/
