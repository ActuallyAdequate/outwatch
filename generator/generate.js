const fs = require('fs-extra');
const path = require('path');
const {marked} = require('marked');
require('./marked_extensions');
const yaml = require('js-yaml');

const srcDir = path.join(__dirname, '../content');
const buildDir = path.join(__dirname, '../build');
const stylesSrcDir = path.join(__dirname, '../styles');
const stylesBuildDir = path.join(buildDir, 'styles');
const defaultCssFile = 'default.css';

const extractFrontMatter = (fileContent) => {
    const frontMatterMatch = fileContent.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontMatterMatch) {
      const frontMatter = yaml.load(frontMatterMatch[1]);
      const markdownContent = fileContent.slice(frontMatterMatch[0].length);
      return { frontMatter, markdownContent };
    }
    return { frontMatter: {}, markdownContent: fileContent };
  };

// Function to convert Markdown files to HTML with specified CSS
const convertMarkdownToHtml = (markdown, cssFile, defaultCssFile, backgroundPicture) => {
    const htmlContent = marked(markdown);
    let cssFilePath = "";
    if(cssFile != undefined) {
      cssFilePath = path.join('styles', cssFile);
    }
    const defaultCssFilePath = path.join('styles', defaultCssFile);
    const cssLink = `<link rel="stylesheet" href="${cssFilePath}">`;
    const defaultCssLink = `<link rel="stylesheet" href="${defaultCssFilePath}">`;
    const backgroundPictureUrl = `styles/${backgroundPicture}`;
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Outwatch</title>
        ${cssFile != undefined ? `${defaultCssLink} ${cssLink}`: `${defaultCssLink}`}
      </head>
      <body class='background' ${backgroundPicture != undefined ? `style="background-image: url('${backgroundPictureUrl}');"` : ""}>
        <div ></div>
        <article>
        ${htmlContent}
        </article>
      </body>
      </html>
    `;
  };
  
  // Function to process files in the src directory
  const generateSite = async () => {
    try {
        // Ensure the build directory exists
        await fs.ensureDir(buildDir);
        await fs.ensureDir(stylesBuildDir);

        // Copy all CSS files from styles to build/styles
        await fs.copy(stylesSrcDir, stylesBuildDir);
  
      // Read all files from the src directory
      const files = await fs.readdir(srcDir);
      // Process each file
      for (const file of files) {
        const filePath = path.join(srcDir, file);
        const extension = file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2);

        if(extension == "md") {
          const fileContents = await fs.readFile(filePath, 'utf8');
          const { frontMatter, markdownContent } = extractFrontMatter(fileContents);
          contents = convertMarkdownToHtml(markdownContent, frontMatter.css, defaultCssFile, frontMatter.background);
          buildFilePath = path.join(buildDir, file.replace('.md', '.html'));
          await fs.outputFile(buildFilePath, contents);
        } else {
          fs.copyFile(filePath, path.join(buildDir, file));
        }
      
        console.log(`Successfully Built ${file}`); 
      }
    } catch (error) {
      console.error('Error generating site:', error);
    }
  };
  
  // Run the generator
  generateSite();