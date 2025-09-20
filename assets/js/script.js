//Global variables for data storage
let workouts = [];
let achievements = [];
let totalStats = {
  workouts:0, 
  minutes: 0,
  calories: 0,
  streak: 0
};

//Initialise the applicaiton
function init {
  loadData();
  initChart();
  updateStats();
  checkAchievements();
}

//Load data from local storage
function loadData() {
  const savedWorkouts = JSON.parse(localStorage.getItem('fittrack_workouts') || '[]');
  const savedStats = JSON.parse(localStorage.getItem('fittrack_stats') || '{"workouts":0,"minutes":0, "calories":0, "streak":0}');

  const savedAchievements = JSON.parse(localStorage.getItem('fittrack_achievements') || '[]');

  workouts = savedWorkouts
}