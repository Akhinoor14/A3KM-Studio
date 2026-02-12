<!-- MOBILE NAVBAR INTEGRATION SCRIPT
     Add this snippet to all mobile pages before closing </body> tag
     
     Pages to update:
     - home-mobile.html
     - about-mobile.html  
     - blog-mobile.html
     - contact-mobile.html
     - classwork-mobile.html
     - homework-mobile.html
     - solo-mobile.html
     - electronics-mobile.html
     - electronics-mobile-new.html
     - browse-files-mobile.html
-->

<!-- Step 1: Add to <head> section -->
<link rel="stylesheet" href="mobile-navbar.css" />

<!-- Step 2: Add before closing </body> tag -->
<div id="mobileNavbarContainer"></div>
<script>
  fetch('mobile-navbar.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('mobileNavbarContainer').innerHTML = html;
    })
    .catch(e => console.error('Failed to load mobile navbar:', e));
</script>

<!-- Step 3: Remove OLD nav-quick-icons element if exists -->
<!--
  Find and DELETE this block:
  
  <nav class="nav-quick-icons">
    <a href="home-mobile.html" class="nav-icon" ...>...</a>
    ...
  </nav>
-->
