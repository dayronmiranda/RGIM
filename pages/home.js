export async function renderHome(container) {
  // Cargar el CSS específico para home
  if (!document.querySelector('link[href*="home.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/styles/home.css';
    document.head.appendChild(link);
  }

  // Asegurar que no haya scroll y altura correcta en Safari
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Forzar altura real del viewport
    const realHeight = window.innerHeight;
    document.body.style.height = `${realHeight}px`;
    document.documentElement.style.height = `${realHeight}px`;
    container.style.height = `${realHeight}px`;
  };

  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);

  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  container.style.overflow = 'hidden';
  container.style.width = '100vw';

  container.innerHTML = `
    <div class="home-container">
    	<img id="wallpaper" src="C:\Users\Usuario1\Documents\Roy\Site images\wallpaper.png">
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
