const cheerio = require('cheerio');
const fs = require('fs');

const categories = [
  { title: 'Kolajenler', slug: 'kolajenler', url: 'https://sidrex.com/collections/kolajenler' },
  { title: 'Bağışıklık Desteði', slug: 'ihtiyac-bagisiklik', url: 'https://sidrex.com/collections/ihtiyac-bagisiklik' },
  { title: 'Bitkisel Örünler', slug: 'bitkisel-takviye', url: 'https://sidrex.com/collections/bitkisel-takviye' },
  { title: 'Vitamin ve Mineraller', slug: 'vitamin-mineral', url: 'https://sidrex.com/collections/vitamin-mineral' },
  { title: 'Çocuk Þrünleri', slug: 'ihtiyac-cocuk', url: 'https://sidrex.com/collections/ihtiyac-cocuk' }
];

async function run() {
  let sql = 'DELETE FROM products;\ndelete from sections;\n\n';

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    
    let sectionId = '00000000-0000-0000-0000-00000000000' + (i+1);
    sql += `INSERT INTO sections (id, title, slug, sort_order) VALUES ('${sectionId}', '${cat.title}', '${cat.slug}', ${i});\n`;

    try {
      const res = await fetch(cat.url);
      const text = await res.text();
      const $ = cheerio.load(text);
      
      const productsToAdd = [];
      
      $('.grid-product, .product-card, .grid-item, .card-wrapper, .product-item').each((idx, el) => {
        let title = $(el).find('.grid-product__title, .card-information__text, h3, .product-item__title').first().text().trim();
        let img = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src') || $(el).find('img').first().attr('srcset');
        let link = $(el).find('a').first().attr('href');
        
        if (title && title !== '') {
          if (img && img.startsWith('//')) {
            img = 'https:' + img;
          }
          if (img && img.includes('?')) {
            img = img.split('?')[0];
          }
          if (img && img.includes(',')) {
            img = img.split(',')[0].split(' ')[0];
          }
          if (img && img.startsWith('//')) {
            img = 'https:' + img;
          }
          
          let slug = link ? link.split('/').pop() : title.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
          
          if (!productsToAdd.find(p => p.title === title)) {
            productsToAdd.push({
              title, slug, img
            });
          }
        }
      });

      productsToAdd.forEach((p, pIdx) => {
        let pId = sectionId.substring(0, 32) + (pIdx+1).toString().padStart(4, '0');
        sql += `INSERT INTO products (id, section_id, title, slug, description, thumbnail_url, is_published, video_type) VALUES ('${pId}', '${sectionId}', '${p.title.replace(/'/g, "''")}', '${p.slug}', '${p.title.replace(/'/g, "''")} hakkında detaylı bilgiler.', '${p.img}', true, 'embed');\n`;
      });
      
      sql += '\n\n';

    } catch (e) {
      console.error(e);
    }
  }
  
  fs.writeFileSync('seed.sql', sql);
  console.log('SQL generated in seed.sql');
}

run();
