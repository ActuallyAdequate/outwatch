const fs = require('fs-extra');
const path = require('path');
const {marked} = require('marked');
const yaml = require('js-yaml');

const srcDir = path.join(__dirname, '../content');
const buildDir = path.join(__dirname, '../build');
const stylesSrcDir = path.join(__dirname, '../styles');
const stylesBuildDir = path.join(buildDir, 'styles');
const defaultCssFile = 'default.css';

const extractFrontMatter = (fileContent) => {
    const frontMatterMatch = fileContent.match(/^---\n([\s\S]+?)\n---\n/);
    if (frontMatterMatch) {
      const frontMatter = yaml.load(frontMatterMatch[1]);
      const content = fileContent.slice(frontMatterMatch[0].length);
      return { frontMatter, content };
    }
    return { frontMatter: {}, content: fileContent };
  };

// Function to convert Markdown files to HTML with specified CSS
const convertMarkdownToHtml = (markdown, cssFile) => {
    const htmlContent = marked(markdown);
    const cssFilePath = path.join('styles', cssFile);
    const cssLink = `<link rel="stylesheet" href="${cssFilePath}">`;
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        ${cssLink}
      </head>
      <body>
        ${htmlContent}
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
        const fileContents = await fs.readFile(filePath, 'utf8');
        const { frontMatter, content } = extractFrontMatter(fileContents);
        const cssFile = frontMatter.css || defaultCssFile;
        const htmlContent = convertMarkdownToHtml(content, cssFile);
  
        const outputFilePath = path.join(buildDir, file.replace('.md', '.html'));
        await fs.outputFile(outputFilePath, htmlContent);
  
        console.log(`Converted ${file} to HTML.`);
      }
    } catch (error) {
      console.error('Error generating site:', error);
    }
  };
  
  // Run the generator
  generateSite();