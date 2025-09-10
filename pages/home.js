export async function renderHome(container) {
  // Cargar el CSS específico para home
  if (!document.querySelector('link[href*="home.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/styles/home.css';
    document.head.appendChild(link);
  }

  container.innerHTML = `
    <div class="home-container">
    	<img id="Mask_Group_2" src="assets/images/Mask_Group_2.png" srcset="assets/images/Mask_Group_2.png 1x, assets/images/Mask_Group_2@2x.png 2x">

    	<svg class="contrast">
    		<rect id="contrast" rx="0" ry="0" x="0" y="0" width="375" height="812">
    		</rect>
    	</svg>
    	<img id="hero_image" src="assets/images/hero_image.png" srcset="assets/images/hero_image.png 1x, assets/images/hero_image@2x.png 2x">

    	<svg class="shadom_m" viewBox="0 0 100 100" preserveAspectRatio="none">
    		<linearGradient id="shadom_m" spreadMethod="pad" x1="0.5" x2="0.5" y1="0" y2="1">
    			<stop offset="0" stop-color="#000" stop-opacity="0"></stop>
    			<stop offset="0.5356" stop-color="#000" stop-opacity="0.62"></stop>
    			<stop offset="1" stop-color="#000" stop-opacity="1"></stop>
    		</linearGradient>
    		<rect id="shadom_m" rx="0" ry="0" x="0" y="0" width="100" height="100">
    		</rect>
    	</svg>
    	<div id="Text_logo">
    		<span>RGIM</span>
    	</div>
    	<div id="menu_area">
    		<div onclick="window.location.href='/#/store'" id="text_visitStore">
    			<span>Visitar tienda</span>
    		</div>
    		<div id="text_contact">
    			<span>Contacto</span>
    		</div>
    		<svg class="Line_5" viewBox="0 0 151 1">
    			<path id="Line_5" d="M 0 0 L 151 0">
    			</path>
    		</svg>
    	</div>
    </div>
  `;

  // Initialize the application for navigation
  if (window.application) {
    window.application.initialize();
  }
}
