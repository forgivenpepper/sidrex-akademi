const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');

const SUPABASE_URL = 'https://hvgkqfwqtaifeuszeskt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2Z2txZndxdGFpZmV1c3plc2t0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NTk1MjYsImV4cCI6MjEwNTUzNTUyNn0.Q43Tg5oi0xwIaHHRxL1KDBKZwB2Fn1KR35ODoBRHS_Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const categories = [
  { title: 'Kolajenler', slug: 'kolajenler', url: 'https://sidrex.com/collections/kolajenler' },
  { title: 'Baðýþýklýk Desteði', slug: 'ihtiyac-bagisiklik', url: 'https://sidrex.com/collections/ihtiyac-bagisiklik' },
  { title: 'Bitkisel Ürünler', slug: 'bitkisel-takviye', url: 'https://sidrex.com/collections/bitkisel-takviye' },
  { title: 'Vitamin ve Mineraller', slug: 'vitamin-mineral', url: 'https://sidrex.com/collections/vitamin-mineral' },
  { title: 'Çocuk Ürünleri', slug: 'ihtiyac-cocuk', url: 'https://sidrex.com/collections/ihtiyac-cocuk' }
];

async function run() {
  console.log('Clearing old products & sections...');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('sections').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    console.log('Processing category: ' + cat.title);
    
    // Insert section
    const { data: sectionData, error: sectionError } = await supabase
      .from('sections')
      .insert({ title: cat.title, slug: cat.slug, sort_order: i })
      .select('id')
      .single();
      
    if (sectionError) {
      console.error('Error inserting section:', sectionError);
      continue;
    }
    
    const sectionId = sectionData.id;

    // Fetch products
    try {
      const res = await fetch(cat.url);
      const text = await res.text();
      const $ = cheerio.load(text);
      
      const productsToAdd = [];
      
      // Shopify selectors
      $('.grid-product, .product-card, .grid-item, .card-wrapper').each((idx, el) => {
        let title = $(el).find('.grid-product__title, .card-information__text, h3').first().text().trim();
        let img = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src');
        let link = $(el).find('a').first().attr('href');
        
        if (title && title !== '') {
          if (img && img.startsWith('//')) {
            img = 'https:' + img;
          }
          if (img && img.includes('?')) {
            img = img.split('?')[0];
          }
          
          let slug = link ? link.split('/').pop() : title.toLowerCase().replace(/\s+/g, '-');
          
          if (!productsToAdd.find(p => p.title === title)) {
            productsToAdd.push({
              section_id: sectionId,
              title: title,
              slug: slug,
              description: title + ' hakkýnda detaylý bilgiler.',
              specs: {},
              video_type: 'embed',
              video_url: null,
              thumbnail_url: img || 'https://via.placeholder.com/300?text=No+Image',
              is_published: true
            });
          }
        }
      });

      console.log('Found ' + productsToAdd.length + ' products for ' + cat.title);
      
      if (productsToAdd.length > 0) {
        const { error: prodError } = await supabase.from('products').insert(productsToAdd);
        if (prodError) {
          console.error('Error inserting products:', prodError);
        }
      }
    } catch (e) {
      console.error('Failed to fetch/parse category:', e);
    }
  }
  console.log('Done!');
}

run();
