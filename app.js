// Weather API Functions
async function Search() {
  const city = document.getElementById("searchInput").value;
  const apiKey =
    document.getElementById("apiKeyInput").value ||
    localStorage.getItem("weatherApiKey");

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  if (!apiKey) {
    alert("Please enter your Weather API Key");
    return;
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    );
    const data = await response.json();
    
    // Update UI with weather data
    document.getElementById("name").textContent = data.location.name;
    document.getElementById("region").textContent = data.location.region;
    document.getElementById("country").textContent = data.location.country;
    document.getElementById("lat").textContent = data.location.lat;
    document.getElementById("lon").textContent = data.location.lon;
    document.getElementById("localtime").textContent = data.location.localtime;
    document.getElementById("timezone").textContent = data.location.tz_id;

    document.getElementById("temp_c").textContent = `${data.current.temp_c}°C`;
    document.getElementById("temp_f").textContent = `${data.current.temp_f}°F`;
    document.getElementById("condition_text").textContent = data.current.condition.text;
    document.getElementById("condition_icon").innerHTML = `<img src="${data.current.condition.icon}" alt="${data.current.condition.text}">`;
    document.getElementById("last_updated").textContent = `Last updated: ${data.current.last_updated}`;
    document.getElementById("wind_kph").textContent = data.current.wind_kph;
    document.getElementById("humidity").textContent = data.current.humidity;
    document.getElementById("feelslike_c").textContent = data.current.feelslike_c;
    document.getElementById("pressure_mb").textContent = data.current.pressure_mb;
    
    // Trigger lightning effect for thunderstorms
    if (
      data.current.condition.text.toLowerCase().includes("thunder") ||
      data.current.condition.text.toLowerCase().includes("storm")
    ) {
      triggerStormEffect();
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert(
      "Error fetching weather data. Please check your API key and city name."
    );
  }
}

 function quickSearch(city) {
   document.getElementById("searchInput").value = city;
   Search();
 }
 function saveApiKey() {
   const apiKey = document.getElementById("apiKeyInput").value;
   if (apiKey) {
     localStorage.setItem("weatherApiKey", apiKey);
     alert("API Key saved successfully!");
  }
 }

function triggerStormEffect() {
  lightningBolts.forEach((bolt) => {
    bolt.userData.active = true;
    bolt.material.color.setHex(0xffffff);
    bolt.material.opacity = 1;
    
    setTimeout(() => {
      bolt.material.color.setHex(0x4a90e2);
      bolt.material.opacity = 0.3;
      bolt.userData.active = false;
      bolt.userData.timer = 50;
    }, 100);
  });
}

// Load saved API key
window.addEventListener("DOMContentLoaded", () => {
  const savedKey = localStorage.getItem("weatherApiKey");
  if (savedKey) {
    document.getElementById("apiKeyInput").value = savedKey;
  }

  initThreeJS();

  // Search for Colombo by default
  setTimeout(() => {
    document.getElementById("searchInput").value = "Colombo";
    Search();
  }, 1000);
});

// Three.js Lightning Effect
  let scene,
    camera,
    renderer,
    lightningBolts = [];
  
  function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("threejs-canvas"),
      alpha: true,
      antialias: true,
    });
  
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
  
    camera.position.z = 5;
  
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x0a3b5c, 0.5);
    scene.add(ambientLight);
  
    // Add directional light for lightning effect
    const directionalLight = new THREE.DirectionalLight(0x4a90e2, 0.8);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
  
    // Create lightning bolts
    for (let i = 0; i < 5; i++) {
      createLightningBolt();
    }
  
    animate();
  }
  
  function createLightningBolt() {
    const points = [];
    const startY = 10;
    const endY = -10;
    const segments = 10;
  
    points.push(new THREE.Vector3(0, startY, 0));
  
    for (let i = 1; i < segments; i++) {
      const x = (Math.random() - 0.5) * 2;
      const y = startY - (i / segments) * (startY - endY);
      points.push(new THREE.Vector3(x, y, 0));
    }
  
    points.push(new THREE.Vector3(0, endY, 0));
  
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.3,
    });
  
    const lightning = new THREE.Line(geometry, material);
    lightning.position.x = (Math.random() - 0.5) * 20;
    lightning.position.z = Math.random() * 10 - 5;
    lightning.userData = {
      speed: Math.random() * 0.05 + 0.02,
      flicker: Math.random() * 0.5 + 0.5,
      active: false,
      timer: Math.random() * 200 + 100,
    };
  
    scene.add(lightning);
    lightningBolts.push(lightning);
  }
  
  function animateLightning() {
    lightningBolts.forEach((bolt) => {
      bolt.userData.timer--;
  
      if (bolt.userData.timer <= 0) {
        bolt.userData.active = !bolt.userData.active;
        bolt.material.opacity = bolt.userData.active ? 0.8 : 0.1;
        bolt.userData.timer = bolt.userData.active
          ? Math.random() * 10 + 5
          : Math.random() * 200 + 100;
      }
  
      if (bolt.userData.active) {
        bolt.material.opacity = 0.3 + Math.sin(Date.now() * 0.01) * 0.5;
      }
  
      bolt.position.x += bolt.userData.speed;
      if (bolt.position.x > 15) {
        bolt.position.x = -15;
      }
    });
  }
  
  function animate() {
    requestAnimationFrame(animate);
    animateLightning();
    renderer.render(scene, camera);
  }
  
  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
