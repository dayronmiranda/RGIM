/**
 * Script de configuración rápida para Gemini AI
 * Ejecuta este script en la consola del navegador para configurar la API key
 */

// Script para configurar Gemini API Key
(function() {
  console.log('🤖 Configuración de Gemini AI para RGIM Store');
  console.log('==========================================');

  const apiKey = prompt('Ingresa tu API Key de Gemini AI (de https://makersuite.google.com/app/apikey):');

  if (apiKey && apiKey.trim()) {
    // Configurar la API key global
    window.GEMINI_API_KEY = apiKey.trim();

    // Verificar que se configuró correctamente
    console.log('✅ API Key configurada exitosamente!');
    console.log('🔄 Recarga la página para activar la búsqueda con IA');

    // Mostrar instrucciones
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Recarga la página (F5)');
    console.log('2. Prueba la búsqueda con términos como "auriculares", "teléfono", etc.');
    console.log('3. Deberías ver logs en la consola indicando que Gemini está activo');

    // Verificar configuración
    setTimeout(() => {
      if (window.GEMINI_API_KEY) {
        console.log('🎉 ¡Configuración completada! Gemini AI está listo para usar.');
      } else {
        console.warn('⚠️  Error: La API key no se configuró correctamente.');
      }
    }, 1000);

  } else {
    console.log('❌ Configuración cancelada. No se configuró ninguna API key.');
    console.log('');
    console.log('💡 Para configurar más tarde:');
    console.log('1. Obtén tu API key en: https://makersuite.google.com/app/apikey');
    console.log('2. Ejecuta: window.GEMINI_API_KEY = "tu_api_key_aqui";');
    console.log('3. Recarga la página');
  }
})();