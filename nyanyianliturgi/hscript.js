    // Fungsi untuk menampilkan gambar penuh
    function showFullImage(src) {
        const overlay = document.createElement('div');
        overlay.classList.add('image-overlay');
        
        const img = document.createElement('img');
        img.src = src;
        
        overlay.appendChild(img);
        document.body.appendChild(overlay);
        
        // Tambahkan event listener untuk menutup overlay
        overlay.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        overlay.style.display = 'flex';
    }
  
/*
  // Fungsi menuliskan hakcipta
        document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; {
            const endnoteDiv = document.getElementById(&quot;hakcipta&quot;);
            endnoteDiv.textContent = &quot;Hak Cipta.&quot;;
            endnoteDiv.classList.add(&quot;endnote&quot;);
        });
*/
  
/*
  // Fungsi menuliskan endnote
        document.addEventListener(&quot;DOMContentLoaded&quot;, () =&gt; {
            const endnoteDiv = document.getElementById(&quot;endnote&quot;);
            endnoteDiv.textContent = &quot;Ini adalah contoh.&quot;;
            endnoteDiv.classList.add(&quot;endnote&quot;);
        });
*/
