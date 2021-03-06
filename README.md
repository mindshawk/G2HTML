# What is it? 

Google Docs plugin that converts Google Doc to simple HTML that can be used in various blogs.

## Settings

All the settings are stored inside the `g2html_settings.json` file. This file is created by the plugin in the root folder of your Google Drive. It's not required to have it here, you can have it in any folder, naming does not matter. 
Only those settings that are can be changed frequently are visible in the UI. Others (such as replacements) can be changed by editing the settings file (see the **Customization** section below).

### UI settings
#### Generation

1. **Paragraphs** - wraps each paragraph in `<p></p>`
2. **id attributes for paragraphs** - automatically generate `id` attribute for `h` tags based on the tag content
2. **Images** - generate image markup or skip all of them
3. **Gifs** - generate specific markup for GIFs (preview, JB-specific site markup). Upload `image.png` and `image.gif` at the same time to blog, set only link to gif via ⌘K. 

#### Transform

1. **Always make image width /= 2** - useful when you don't have images with @2x postfix. 
2. **Limit max image width to** - limits image width to the specified value. 


#### Inspections

1. **Check image alts**. You can specify image title or description in Google Doc. Plugin checks if one of them is not empty and generate image `alt` attribute.
2. **Check links for 404** - tries to load the content for each url in the document and shows error if cannot load. 
3. **Check empty links** - shows errors for empty links.
4. **TBD** - shows warning for every line containing `TBD`.

Errors / warnings are displayed in the list. Each list item is clickable, click scrolls the document to the line / place with error. 

### Customization

To customize any settings that are not visible in the plugin UI, download the `g2html_settings.json`, edit it and replace your current settings file with it. After that plugin should use your own settings. 

### All settings

1. `paragraphs`. **Value**: `true` or `false`. Stores **Generate paragraphs** option.
2. `heading_ids`. **Value**: `true` or `false`.Stores **Generate id attributes for paragraphs**.
3. `gifs`. **Value**: `true` or `false`.Stores **Generate gifs** option.
4. `generate_images`. **Value**: `true` or `false`. Stores **Generate images** option.
5. `fetch_links`. **Value**: `true` or `false`. Stores **Check links for 404** option.
6. `empty_links`. **Value**: `true` or `false`. Stores **Check empty links** option.
7. `image_alts`. **Value**: `true` or `false`. Stores **Check image alts** option.
8. `idtemplates`. Array of templates for replacing certain characters for header `id` attribute. Each template has the following format:
```json
{
     "regexp": "c\\+\\+", //escaped RegExp
     "replacement": "cpp" //text to insert instead of characters matched by regexp
}
``` 
9. `templates`. Array of templates for text transformations. First accepted template format:
```json
{
    "attributes": {
        "LINK_URL": true
    },
    "replacement": "<a href=\"LINK_URL\">$TEXT$</a>"
}
```
   Each text element in the Google Docs a) contains a text b) has some markup attributes (background color, foreground color, font family etc).
   `attributes` map contains key-value pairs. The key is one of the text [attribute names](https://developers.google.com/apps-script/reference/document/attribute). Value is the value of this attribute. `<attribute>:null` pair means that there should be no such attribute for the text.
   `replacement` is the replacement markup to be inserted into the HTML. The `$TEXT$` variable contains the text of the text element. You can use various text attributes in the markup. To do that, just insert the text attribute name. 
    
   In the example above, we match all the text elements having non-empty link (`LINK_URL` attribute). In the resulting HTML, each of such elements is wrapped in `<a>` tag with a link from the `LINK_URL` attribute. 

   Second accepted template format:
```json
{
    "regexp": "\\[d\\](.*)\\[\\/d\\]",
    "replacement": "<p><a class=\"jb-download-button\" href=\"some url\"><i class=\"download-icon\"></i>$1</a></p>"
}
```
    
   `regexp` is a regular expression that matches the text of the text element. Nothing else, no attributes are accepted here. 
   You can define matcher groups and use them inside the `replacement` attribute. Example below shows how we can use the following custom text in our Google Document:
    
   `[d]Download My IDE![/d]`
    
   This text is transformed into the following HTML markup:
```html
    <p><a class="jb-download-button" href="some url"><i class="download-icon"></i>Download My IDE!</a></p>
```
    
**Suggestion**: as some typical text elements (like links) are handled by the general parser logic, it's not recommended to alter them via templates for now. There is no easy way to simplify the example above - the only way to have the correct template for you is to configure it once for your product. 
  
Checklist for custom templates:

1. Check regexp escaping.
2. Check if your json is valid at all.
3. If something does not work, please ping me. 

## Markup reference

1. `Consolas` font = `<code>text</code>`
2. `[d]Title[/d]` = `<p><a class="jb-download-button" href="some url"><i class="download-icon"></i>Title</a></p>`. Change `some url` to your IDE's download url.
3. `[e]http://youtube_link[/e]` = `<iframe width="560" height="315" src="http://youtube_link" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
4. `[more]` = `<!--more-->`
5. ⌘⌥Y→ Set Alt or Description for image = `alt` attribute for having the text specified. 
6. Select image → ⌘K → Set link = `src` attribute of the image having this link. For gifs: set the link to the .gif image and have the preview .png with the same URL as for .gif image to automatically generate the gif player markup.     
7. Image having @2x at the end = width / 2 for the `width` attribute.

## Controls (from left to right)

1. Re-run conversion with previously selected settings
2. Open settings
3. Copy generated HTML to clipboard
4. Download generated HTML as HTML file
5. Help link

## Limitations

Sometimes bookmarks generated for errors are not removed from the document because of Google Docs bug. 

## Third-party libraries

1. [ImgApp](https://github.com/tanaikech/ImgApp)
2. [GoogleDoc2Html](https://github.com/oazabir/GoogleDoc2Html) - borrowed initial version from here. 
