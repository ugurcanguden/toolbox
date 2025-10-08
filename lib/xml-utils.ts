export interface XMLNode {
  type: 'element' | 'text' | 'comment';
  name?: string;
  attributes?: Record<string, string>;
  children?: XMLNode[];
  text?: string;
}

// Parse XML string to DOM
export function parseXML(xmlString: string): Document | null {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      return null;
    }
    
    return xmlDoc;
  } catch (error) {
    return null;
  }
}

// Format XML with indentation
export function formatXML(xmlString: string, indent: number = 2): string {
  try {
    const xmlDoc = parseXML(xmlString);
    if (!xmlDoc) return xmlString;
    
    return formatNode(xmlDoc.documentElement, 0, indent);
  } catch (error) {
    return xmlString;
  }
}

function formatNode(node: Element, level: number, indent: number): string {
  const indentStr = ' '.repeat(level * indent);
  const nextIndentStr = ' '.repeat((level + 1) * indent);
  
  let result = indentStr + '<' + node.nodeName;
  
  // Add attributes
  for (let i = 0; i < node.attributes.length; i++) {
    const attr = node.attributes[i];
    result += ` ${attr.name}="${attr.value}"`;
  }
  
  // Check if has children
  const childNodes = Array.from(node.childNodes);
  const elementChildren = childNodes.filter(n => n.nodeType === 1);
  const textContent = node.textContent?.trim();
  
  if (elementChildren.length === 0 && !textContent) {
    // Self-closing tag
    result += ' />\n';
  } else if (elementChildren.length === 0 && textContent) {
    // Text only
    result += '>' + textContent + '</' + node.nodeName + '>\n';
  } else {
    // Has children
    result += '>\n';
    
    for (const child of childNodes) {
      if (child.nodeType === 1) {
        // Element node
        result += formatNode(child as Element, level + 1, indent);
      } else if (child.nodeType === 3) {
        // Text node
        const text = child.textContent?.trim();
        if (text) {
          result += nextIndentStr + text + '\n';
        }
      } else if (child.nodeType === 8) {
        // Comment node
        result += nextIndentStr + '<!--' + child.textContent + '-->\n';
      }
    }
    
    result += indentStr + '</' + node.nodeName + '>\n';
  }
  
  return result;
}

// Minify XML
export function minifyXML(xmlString: string): string {
  try {
    const xmlDoc = parseXML(xmlString);
    if (!xmlDoc) return xmlString;
    
    return minifyNode(xmlDoc.documentElement);
  } catch (error) {
    return xmlString;
  }
}

function minifyNode(node: Element): string {
  let result = '<' + node.nodeName;
  
  // Add attributes
  for (let i = 0; i < node.attributes.length; i++) {
    const attr = node.attributes[i];
    result += ` ${attr.name}="${attr.value}"`;
  }
  
  const childNodes = Array.from(node.childNodes);
  const elementChildren = childNodes.filter(n => n.nodeType === 1);
  const textContent = node.textContent?.trim();
  
  if (elementChildren.length === 0 && !textContent) {
    result += '/>';
  } else if (elementChildren.length === 0 && textContent) {
    result += '>' + textContent + '</' + node.nodeName + '>';
  } else {
    result += '>';
    for (const child of childNodes) {
      if (child.nodeType === 1) {
        result += minifyNode(child as Element);
      } else if (child.nodeType === 3) {
        const text = child.textContent?.trim();
        if (text) result += text;
      }
    }
    result += '</' + node.nodeName + '>';
  }
  
  return result;
}

// Validate XML
export function validateXML(xmlString: string): { valid: boolean; error?: string } {
  try {
    const xmlDoc = parseXML(xmlString);
    if (!xmlDoc) {
      return { valid: false, error: 'Failed to parse XML' };
    }
    
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      return { valid: false, error: parserError.textContent || 'Invalid XML' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid XML format' };
  }
}

// Convert DOM Element to XMLNode for tree view
export function domToXMLNode(element: Element): XMLNode {
  const node: XMLNode = {
    type: 'element',
    name: element.nodeName,
    attributes: {},
    children: [],
  };
  
  // Extract attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (node.attributes) {
      node.attributes[attr.name] = attr.value;
    }
  }
  
  // Process children
  for (const child of Array.from(element.childNodes)) {
    if (child.nodeType === 1) {
      // Element node
      node.children?.push(domToXMLNode(child as Element));
    } else if (child.nodeType === 3) {
      // Text node
      const text = child.textContent?.trim();
      if (text) {
        node.children?.push({
          type: 'text',
          text: text,
        });
      }
    } else if (child.nodeType === 8) {
      // Comment node
      node.children?.push({
        type: 'comment',
        text: child.textContent || '',
      });
    }
  }
  
  return node;
}

