/* Render compartido de fichas de hotel con galería, tabla de habitaciones y links oficiales */
function setCur(c){
  document.body.dataset.cur=c;
  var a=document.getElementById('btnMXN'), b=document.getElementById('btnUSD');
  if(a) a.classList.toggle('act',c==='mxn');
  if(b) b.classList.toggle('act',c==='usd');
  document.querySelectorAll('[data-usd]').forEach(function(el){
    var usd = el.dataset.usd;
    el.textContent = (c==='usd') ? usd : usdToMxn(usd);
  });
}
/* convierte "2,480-3,400" o "1,724 + imp." a pesos manteniendo el formato */
function usdToMxn(s){
  return s.replace(/[\d,]+/g, function(n){
    var v = parseFloat(n.replace(/,/g,''));
    if(isNaN(v)) return n;
    return Math.round(v*17.35/100)*100 === 0 ? String(Math.round(v*17.35)) : Math.round(v*17.35).toLocaleString('es-MX');
  });
}
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function hotelCard(h){
  var imgs = (h.img||[]).filter(Boolean);
  var gal = '';
  if(imgs.length){
    gal = '<div class="hgal">' + imgs.map(function(u,i){
      var cap = ['Habitación','Alberca y zonas','Playa'][i] || 'Vista';
      return '<a class="hgi" href="'+esc(h.gal)+'" target="_blank" rel="noopener" title="Ver galería oficial">'
        + '<img loading="lazy" src="'+esc(u)+'" alt="'+esc(h.nombre+' — '+cap)+'" onerror="this.closest(\'.hgi\').classList.add(\'noimg\')">'
        + '<span class="hgc">'+cap+'</span></a>';
    }).join('') + '</div>';
  } else {
    gal = '<div class="hgal nogal"><a href="'+esc(h.gal)+'" target="_blank" rel="noopener">Ver galería de fotos oficial ↗</a>'
        + '<span class="small">Este hotel carga sus imágenes por JavaScript y no permite enlazarlas directamente.</span></div>';
  }
  var alerta = h.alerta ? '<div class="halert"><b>Ojo:</b> '+esc(h.alerta)+'</div>' : '';
  var badge = h.badge ? ' <span class="tag '+(h.badgeCls||'ok')+'">'+esc(h.badge)+'</span>' : '';

  var rows = h.r.map(function(x){
    return '<tr><td><b>'+esc(x[0])+'</b></td><td class="num">'+esc(x[1])+'</td><td>'+esc(x[2])+'</td><td class="inc">'+esc(x[3])+'</td>'
      + '<td class="num"><span data-usd="'+esc(x[4])+'">'+esc(x[4])+'</span></td>'
      + '<td class="num tot"><span data-usd="'+esc(x[5])+'">'+esc(x[5])+'</span></td></tr>';
  }).join('');

  return '<div class="hotel" id="'+esc(h.id)+'">'
   + '<div class="hhead"><h3>'+esc(h.nombre)+badge+'</h3>'
   + '<div class="hmeta">'+esc(h.cadena)+' · '+esc(h.zona)+' · <b>TripAdvisor '+esc(h.ta)+'</b> con '+esc(h.taN)+' reseñas · '+esc(h.taRank)+'</div></div>'
   + gal
   + '<p class="hdatos">'+esc(h.datos)+'</p>'
   + alerta
   + '<div class="tblwrap"><table class="rooms"><thead><tr><th>Tipo de habitación</th><th class="num">m²</th><th>Ocupación</th><th>Incluye</th><th class="num">Por noche</th><th class="num">Total 4 noches</th></tr></thead><tbody>'+rows+'</tbody></table></div>'
   + '<div class="hlinks"><a class="btn" href="'+esc(h.web)+'" target="_blank" rel="noopener">Sitio oficial ↗</a>'
   + '<a class="btn" href="'+esc(h.rooms)+'" target="_blank" rel="noopener">Ver habitaciones ↗</a>'
   + '<a class="btn" href="'+esc(h.gal)+'" target="_blank" rel="noopener">Galería de fotos ↗</a></div>'
   + '</div>';
}

function renderHotels(containerId, dest, tipo){
  var el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = HOTELS.filter(function(h){ return h.dest===dest && h.tipo===tipo; }).map(hotelCard).join('');
  setCur(document.body.dataset.cur||'mxn');
}
