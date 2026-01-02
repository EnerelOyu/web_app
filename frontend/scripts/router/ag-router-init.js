window.addEventListener('DOMContentLoaded', () => {
  const router = document.getElementById('main-router');
  if (!router) return;

  // router-ын бүртгэл - URL болон харгалзах хуудсыг холбох
  router.registerRoute('/home', '<ag-page-home></ag-page-home>');                        // Нүүр хуудас
  router.registerRoute('/spots', '<ag-page-spots></ag-page-spots>');                     // Газруудын жагсаалт
  router.registerRoute('/spot-info', '<ag-page-spot-info></ag-page-spot-info>');         // Газрын дэлгэрэнгүй
  router.registerRoute('/plan', '<ag-page-plan></ag-page-plan>');                        // Аяллын төлөвлөгөө
  router.registerRoute('/guides', '<ag-page-guides></ag-page-guides>');                  // Хөтөчдийн жагсаалт
  router.registerRoute('/guide-signup', '<ag-page-guide-signup></ag-page-guide-signup>'); // Хөтөч бүртгүүлэх
  router.registerRoute('/traveler-signup', '<ag-page-traveler-signup></ag-page-traveler-signup>'); // Аялагч бүртгүүлэх
  router.registerRoute('/guide-profile', '<ag-page-guide-profile></ag-page-guide-profile>'); // Хөтөчийн профайл

  // Эхний хуудсыг харуулах
  router.onRouteChange();
});
