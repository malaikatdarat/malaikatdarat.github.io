  document.addEventListener("DOMContentLoaded", () => {
  console.log("Skrip dimulai...");
    const tabHtml = `
        <div class="tab-wrap">
            <input type="radio" id="tab1" name="tabGroup1" class="tab" checked>
            <label for="tab1">Partitur 🎼</label>
            <input type="radio" id="tab2" name="tabGroup1" class="tab">
            <label for="tab2">Syair 📖</label>
            <input type="radio" id="tab3" name="tabGroup1" class="tab">
            <label for="tab3">Audio/Video 🎧</label>
            <input type="radio" id="tab4" name="tabGroup1" class="tab">
            <label for="tab4">Unduh 📥</label>
            <input type="radio" id="tab5" name="tabGroup1" class="tab">
            <label for="tab5">Detail Lagu ℹ️</label>
			
			<div class="tab__content"></div>
			<div class="tab__content"></div>
			<div class="tab__content"></div>
			<div class="tab__content"></div>
			<div class="tab__content"></div>
        </div>
    `;
	
    const container = document.getElementById('mantab');
    container.innerHTML = tabHtml;

    console.log('Tab-wrap berhasil dimuat.');

    const template = document.getElementById('tab1-content');
    const tab1Content = template.content.cloneNode(true);
    const tabContents = container.querySelectorAll('.tab__content');
    tabContents[0].appendChild(tab1Content);

    const template2 = document.getElementById('tab2-content');
    const tab2Content = template2.content.cloneNode(true);
    tabContents[1].appendChild(tab2Content);
	
	const template3 = document.getElementById('tab3-content');
    const tab3Content = template3.content.cloneNode(true);
    tabContents[2].appendChild(tab3Content);
	
	const template4 = document.getElementById('tab4-content');
    const tab4Content = template4.content.cloneNode(true);
    tabContents[3].appendChild(tab4Content);
	
	const template5 = document.getElementById('tab5-content');
    const tab5Content = template5.content.cloneNode(true);
    tabContents[4].appendChild(tab5Content);
});

document.addEventListener('DOMContentLoaded', function() {
  const rawElement = document.getElementById('rawDataTabel');
  const rawText = rawElement.textContent.trim();
  const lines = rawText.split('\n');
  
  const table = document.createElement('table');
  table.className = 'infobox';

  function processLinks(str) {
    let result = str;

    // Proses [[...]]
    result = result.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
      const originalText = p1;
      let urlPart = p1;
      const slashIndex = urlPart.indexOf('/');
      if (slashIndex !== -1) {
        urlPart = urlPart.substring(0, slashIndex);
      }
      urlPart = encodeURIComponent(urlPart).replace(/%20/g, '%20');
      return `<a href="/search/label/${urlPart}" target="_blank">${originalText}</a>`;
    });

    // Proses [http...]
    result = result.replace(/(.*?)\s*\[(https?:\/\/.*?)\]/, (match, textBefore, url) => {
      return `<a href="${url}" target="_blank">${textBefore.trim()}</a>`;
    });

    // Proses {...} -> /p/...html
    result = result.replace(/(.+?)\s*\{(.*?)\}/g, (match, textBefore, p1) => {
        return `<a href="/p/${p1}.html" target="_blank">${textBefore.trim()}</a>`;
    });
    return result;

    return result;
  }

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    if (/^[A-Z0-9\s]+$/.test(line) && line.indexOf(':') === -1) {
      // Kategori
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.colSpan = 2;
      th.classList.add('category');
      th.textContent = line;
      tr.appendChild(th);
      table.appendChild(tr);
    } else {
      // Data (header: value)
      const parts = line.split(':');
      if (parts.length > 1) {
        const header = parts.shift().trim();
        let value = parts.join(':').trim();
        value = processLinks(value);

        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = header;

        const td = document.createElement('td');
        td.innerHTML = value;

        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
      }
    }
  });

  document.getElementById('table-container').appendChild(table);

  // Setelah selesai memproses, hapus elemen <pre> agar tidak tampil
  rawElement.remove();
});

document.addEventListener('DOMContentLoaded', function() {
    const rawSyairElement = document.getElementById('rawDataSyair');
    const rawSyairText = rawSyairElement.textContent.trim();
    const lines = rawSyairText.split('\n');

    const syairContainer = document.getElementById('syair-container');

    const headings = {
        REFRAIN: false,
        REFREN: false,
        ULANGAN: false,
        AYAT: true,
        BAIT: true
    };

    let currentMode = null;
    let currentOl = null;
    let currentP = null;
    let listBuffer = [];

    function closeCurrentStructures() {
        if (currentP) {
            syairContainer.appendChild(currentP);
            currentP = null;
        }
        if (currentOl && listBuffer.length > 0) {
            const li = document.createElement('li');
            const p = document.createElement('p');
            p.innerHTML = listBuffer.join('<br>');
            li.appendChild(p);
            currentOl.appendChild(li);
            listBuffer = [];
        }
        if (currentOl) {
            syairContainer.appendChild(currentOl);
            currentOl = null;
        }
        currentMode = null;
    }

    function processLine(line) {
        line = line.trim();
        
        if (!line && currentMode === 'list' && listBuffer.length > 0) {
            const li = document.createElement('li');
            const p = document.createElement('p');
            p.innerHTML = listBuffer.join('<br>');
            li.appendChild(p);
            currentOl.appendChild(li);
            listBuffer = [];
            return;
        } else if (!line) {
            closeCurrentStructures();
            return;
        }

        const lineUpper = line.toUpperCase();
        let isHeading = false;
        let headingKey = null;
        
        for (let key in headings) {
            if (lineUpper.startsWith(key + ':')) {
                isHeading = true;
                headingKey = key;
                break;
            }
        }

        if (isHeading) {
            closeCurrentStructures();
            
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = line;
            p.appendChild(strong);
            syairContainer.appendChild(p);

            if (headings[headingKey]) {
                currentOl = document.createElement('ol');
                currentMode = 'list';
                listBuffer = [];
            } else {
                currentMode = 'para';
                currentP = document.createElement('p');
            }
        } else {
            if (currentMode === 'list') {
                listBuffer.push(convertLine(line));
            } else if (currentMode === 'para') {
                if (currentP.innerHTML.length > 0) {
                    currentP.innerHTML += '<br>';
                }
                currentP.innerHTML += convertLine(line);
            } else {
                if (!currentP) {
                    currentP = document.createElement('p');
                } else if (currentP.innerHTML.length > 0) {
                    currentP.innerHTML += '<br>';
                }
                currentP.innerHTML += convertLine(line);
            }
        }
    }

    function convertLine(line) {
        const slashIndex = line.indexOf('/');
        if (slashIndex !== -1) {
            const before = line.substring(0, slashIndex).trim();
            const after = line.substring(slashIndex + 1).trim();
            return `<span class="baris1">${before}/</span> <span class="baris2">${after}</span>`;
        }
        return `<span class="baris1">${line}</span>`;
    }

    lines.forEach(processLine);
    closeCurrentStructures();

    rawSyairElement.remove();
});

document.addEventListener('DOMContentLoaded', function() {
    const mediaSource = document.querySelector('.media-source');
    const mediaContainer = document.getElementById('media-container');
    const text = mediaSource.innerHTML;
    let html = '';

    // Proses setiap baris
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    for(let i = 0; i < lines.length; i += 2) {
        const mediaLine = lines[i];
        const channelLine = lines[i + 1];

        if(mediaLine.startsWith('Video:')) {
            const videoMatch = mediaLine.match(/Video: (.*?) \[(.*?)\]/);
            const channelMatch = channelLine.match(/Kanal: (.*?) \[(.*?)\]/);

            if(videoMatch && channelMatch) {
                const [_, title, videoIdWithParams] = videoMatch;
                const [__, channelName, channelId] = channelMatch;
                const embedUrl = `https://youtube.com/embed/${videoIdWithParams}`;
                const videoUrl = `https://www.youtube.com/watch?v=${videoIdWithParams.split('?')[0]}`;
                const channelUrl = `https://www.youtube.com/${channelId}`;
                html += generateVideoHTML(title, videoUrl, embedUrl, channelName, channelUrl);
            }
        } else if(mediaLine.startsWith('Audio:')) {
            const audioMatch = mediaLine.match(/Audio: (.*?) \[(.*?)\]/);
            const channelMatch = channelLine.match(/Kanal: (.*?) \[(.*?)\]/);

            if(audioMatch && channelMatch) {
                const [_, title, trackId] = audioMatch;
                const [__, channelName, audioTrackPath] = channelMatch;
                const audioEmbedUrl = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true`;
                const audioTrackUrl = `https://soundcloud.com/${audioTrackPath}`;
                const channelBase = audioTrackPath.split('/')[0];
                const channelUrl = `https://soundcloud.com/${channelBase}`;
                html += generateAudioHTML(title, audioTrackUrl, channelName, channelUrl, audioEmbedUrl);
            }
        }
    }

    mediaContainer.innerHTML = html;

    // Hapus teks sumber setelah diproses
    mediaSource.remove();
});

function generateVideoHTML(title, videoUrl, embedUrl, channelName, channelUrl) {
    return `
    <!-- Video -->
    <!-- Bagian Judul -->
    <p class="judulvideo">
        <a target="_blank" rel="noopener noreferrer" href="${videoUrl}" title="Tonton di YouTube">🎬 ${title}</a>
        <span>|</span>
        <a target="_blank" rel="noopener noreferrer" href="${channelUrl}" title="Buka kanal YouTube">📺 ${channelName}</a>
    </p>
    <!-- Video Wrapper -->
    <div class="video-wrapper">
        <iframe class="videoiframe"
            src="${embedUrl}"
            allowfullscreen>
        </iframe>
    </div>`;
}

function generateAudioHTML(title, audioTrackUrl, channelName, channelUrl, audioEmbedUrl) {
    return `
    <!-- Audio -->
    <!-- Bagian Judul -->
    <p class="judulaudio">
        <a target="_blank" rel="noopener noreferrer" href="${audioTrackUrl}" title="Dengarkan di SoundCloud">🎶 ${title}</a>
        <span>|</span>
        <a target="_blank" rel="noopener noreferrer" href="${channelUrl}" title="Buka kanal SoundCloud">📻 ${channelName}</a>
    </p>
    <!-- Audio Wrapper -->
    <div class="audio-wrapper">
        <iframe class="audioiframe"
            src="${audioEmbedUrl}"
            allowfullscreen>
        </iframe>
    </div>`;
}
