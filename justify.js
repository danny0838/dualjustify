(function( $, undefined ){

    "use strict";

    /*static variable*/
    var CJK_STRING = 'd',
        NONCJK_STRING = 's',
        TAG = 't',
        JUSTIFY_SPAN = 'justify-span',
        JUSTIFY_HYPHEN = 'justify-hyphen',
        NOJUSTIFY = 'justify-noadjust',

        /*private variable*/

        refBlock,  // last node that needs dualjustify. We store this node because we use it for testing char width
        widthNode, // a span that we used for inserting each single character and measure its width
        widthMap = {};  // store all the single byte character's width

    /*options*/
    var options = {
        'debug': false,
        'selector': '.dualjustify',
        'skipSelectors': 'script,style,textarea,iframe,object,img,embed',
        'regexCJK': /[\u4E00-\u9FFF\uF900-\uFADF\uFE30-\uFE4F\u3400-\u4DBF]/,
        'regexNonCJK': /[\u0000-\u2DFF]/,
        'regexHyphen': /[A-Za-z]/
    };

    /**
     * A function for determing if this is CJK (Chinese/Japanese/Korean) chars
     * @param character {String} The character that we want to test
     * @void
     */
    function isCJK(character) {
        if ( options.regexNonCJK.test(character) ) return false;
        if ( options.regexCJK.test(character) ) return true;
        return getCharWidth(character) == getCharWidth('一');
    }

    /**
     * A function that calculates the char width, and store the value in widthMap.
     * @param character {String} The character that we want to get width
     * @void
     */
    function getCharWidth(character) {

        if (!widthNode) {
            refBlock.append('<span style="visibility:hidden;display:inline;margin:0;padding:0;border:0"></span>');
            widthNode = refBlock.contents().last();
        }

        if (widthMap[character] === undefined) {
            if (character === ' ') {
                widthMap[character] = getCharWidth('e e') - 2 * getCharWidth('e');
            } else {
                widthNode.text(character);
                widthMap[character] = widthNode.width();
            }
        }

        return widthMap[character];
    }

    /**
     * Parse a Node's innerHTML and parse into an array. The array would be look like
     *  [
     *       { type: TAG, text: '<a href="blah">'},
     *       { type: NONCJK_STRING, text: 'abc' },
     *       { type: CJK_STRING, text: '中文'},
     *       { type: TAG, text: '</a>'}
     *  ]
     * @param node {jQuery.Node} a node which we want to parse its innerHTML
     * @return {Array} parsed result
     */
    function parseInnerHtml(node) {
        var output = [], outerhtml, innerhtml, tag, text, currentStringInCJK, i, max, character, currentCharInCJK,
            currentStr = '', nodeName = node[0].nodeName.toLowerCase();

        if (node.is(options.skipSelectors)) {
            // if the node is to be skipped
            output.push({
                type: TAG,
                text: node[0].outerHTML
            });
        } else if (nodeName === 'br') {
            // if node is BR tag, include it directly
            output.push({
                type: TAG,
                text: node[0].outerHTML
            });
        } else if (node[0].childNodes.length === 0 || node.is('.' + JUSTIFY_SPAN)) {
            // base case: this node contains pure text, parse string into array
            text = node.text();
            if (text.length > 0) {
                // initial value
                currentStringInCJK = isCJK(text.charAt(0));

                for (i = 0, max = text.length; i < max; i += 1) {
                    character = text.charAt(i);
                    currentCharInCJK = isCJK(character);

                    if (!currentCharInCJK) {
                        getCharWidth(character);
                    }

                    // if new char uses the same lang w/ current string
                    if (currentCharInCJK === currentStringInCJK) {
                        // append it to current string
                        currentStr += character;
                    } else {
                    // if not, save the previous string into text array
                        output.push({
                            type: currentStringInCJK ? CJK_STRING : NONCJK_STRING,
                            text: currentStr
                        });
                        currentStr = character;
                        currentStringInCJK = currentCharInCJK;
                    }

                }
                // last one
                output.push({
                    type: currentStringInCJK ? CJK_STRING : NONCJK_STRING,
                    text: currentStr
                });
            }

        } else {
            // this is a node which contains more than one child node

            // concat all childnodes results
            node.contents().each(function () {
                var child = $(this);
                output = output.concat(parseInnerHtml(child));
            });

            outerhtml = node[0].outerHTML;
            innerhtml = node[0].innerHTML;

            // if we have outer html
            if (outerhtml.length > innerhtml.length) {

                tag = outerhtml.split(innerhtml +  '</' + nodeName + '>');
                if (tag && tag[0]) {
                    output.unshift({ type: TAG, text: tag[0]});
                    output.push({type: TAG, text: '</' + nodeName + '>'});
                }
            }
        }
        return output;

    }


    /**
     * Transfrom parseInnerHtml results into justified html. The input array is expected to be look like
     *  [
     *       { type: TAG, text: '<a href="blah">'},
     *       { type: NONCJK_STRING, text: 'abc' },
     *       { type: CJK_STRING, text: '中文'},
     *       { type: TAG, text: '</a>'}
     *  ]
     * and the output would be in html, which you can directly use it to replace current node's innerhtml and see justifed result
     * @param elements {Array} an array which represents the content of current node's outer html
     * @param node {jQuery.Node} node that needs dual-justify
     * @return {String} html
     */
    function generateJustifyHtml(elements, node) {

        if (!node || !elements || !Array.isArray(elements)) {
            return;
        }

        var containerWidth = parseInt(node.css('width').replace('px', ''), 10),
            currentLineChars = 0,
            outputHtml = '',
            fontsize = parseInt(node.css('fontSize').replace('px', ''), 10),
            charPerLine = Math.floor(containerWidth / fontsize);

        // looping over all html elements and generating output html
        $.each(elements, function (index, content) {

            if ((index === 0 || index === elements.length - 1) && content.type === TAG) {
                //skip the outer wrapper
                return;
            }

            var textWidth, units, cutpos, classes, textAlign, i, max, spaceleft;

            currentLineChars = currentLineChars % charPerLine;
            if (content.type === TAG) {
                // if the tag is br, it will go to next line, so reset the currentLineChars
                if (content.text === '<br>' || content.text === '<br/>') {
                    currentLineChars = 0;
                }
                // otherwise, just assume it is harmless and include it
                outputHtml += content.text;
            } else if (content.type === CJK_STRING) {
                outputHtml += content.text;
                currentLineChars += content.text.length;
            } else {
                // current element is non-CJK string
                content.text = content.text.trim();
                textAlign = 'center';
                while (content.text.length > 0) {
                    textWidth = 0;
                    units = 0;
                    // new string width
                    classes = JUSTIFY_SPAN;
                    spaceleft = (charPerLine - currentLineChars) * fontsize;  //left space in current row; in pixels
                    for (i = 0, max = content.text.length; i < max; i += 1) {
                        textWidth += widthMap[content.text.charAt(i)];
                        if (spaceleft < textWidth) {
                            // hit line end
                            // we need to cut string here, and the rest will go to next line
                            units = charPerLine - currentLineChars;
                            if (options.regexHyphen.test(content.text.charAt(i - 1)) && options.regexHyphen.test(content.text.charAt(i))) {
                                classes += ' ' + JUSTIFY_HYPHEN;
                                textAlign = 'right';
                            }
                            break;
                        }
                    }
                    units = units || Math.ceil(textWidth / fontsize);
                    cutpos = i;
                    while (cutpos < content.text.length && /\s/.test(content.text.charAt(cutpos))) {
                        cutpos += 1;
                    }
                    outputHtml += '<span class="' + classes + '" style="text-align:' + textAlign + ';width:' + (fontsize * units) + 'px;font-size:' + fontsize + 'px;' + (options.debug ? 'background-color:#FF9;' : '') + '">' + content.text.slice(0, cutpos) + '</span>';
                    content.text = content.text.substring(cutpos);
                    currentLineChars = (currentLineChars + units) % charPerLine;
                    textAlign = content.text.length > 0 ? 'left' : 'center';
                }

            }

        });

        return outputHtml;

    }




    /**
     * A function which transform a node to be dual-justify
     *
     * An example usage would be:
     * (function(){
     *   var options = {
     *       // CSS selector for the article body's paragraph
     *       selector: '.dualjustify'
     *   };
     *   var callback = function(){$.dualJustify(options);};
     *   $(callback);
     *   $(window).resize(callback);
     * })();
     */
    function dualJustify(customOptions) {

        $.extend(options, customOptions);

        var timestart = Date.now(), timeend, blocks = $(options.selector);

        refBlock = blocks.length > 0 ? blocks.last() : null;

        blocks.each(function (index) {
            var node = $(this);
            if (node.is('.' + NOJUSTIFY)) {
                return;
            }

            var text,
                elements,
                justifySpans = node.find('.' + JUSTIFY_SPAN),
                origHtml = node.data("origHtml");

            if (origHtml) node.html(origHtml);

            text = node.text().trim();

            if (text.length * 0.5 > text.replace(/[0-9a-zA-Z]/g, '').length || node.is(options.skipSelectors + ',.' + NOJUSTIFY)) {
                // 1. over half of the text is english, bypass this
                // 2. if there are any iframe/object... which is not inline text, we will skip
                node.addClass(NOJUSTIFY);
                return;
            }

            if (!origHtml) node.data("origHtml", node.html());

            elements = parseInnerHtml(node);
            node.css('word-break', 'break-all').html(generateJustifyHtml(elements, node));

        });
        if (widthNode) {
            widthNode.remove();
        }
        timeend = Date.now();
        if (options.debug) console.log('dualJustify: ' + (timeend - timestart) + 'ms');
    }

    /**
     * jQuery implementation
     */
    $.extend({
        dualJustify: dualJustify
    });

})( jQuery );
