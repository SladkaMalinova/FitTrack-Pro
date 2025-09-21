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

  workouts = savedWorkouts;
  totalStats = savedStats;
  achievements = savedAchievements;
}

//Save data to local storage
function logWorkout() {
  const type = document.getElementById('workoutType').value;
  const duration = parseInt(document.getElementById('workoutDuration').value);
  const intensity = document.getElementById('workoutIntensity').value;

  if(!duration || duration < 1) {
    alert('Please enter a valid duration!');
    return;
  }

  const calories = calculateCalories(type, duration, intensity);
  const workout = {
    type: type, 
    duration: duration,
    intensity: intensity,
    calories:calories, 
    date: new Date().toLocateDateString(),
    timestamp: new Date()
  };

  workouts.push(workout);
  totalStats.workouts++;
  totalStats.minutes += duration;
  totalStats.calories += calories;

  updateWorkoutLog();
  updateStats();
  updateChart();
  checkAchievements();
  saveData();

//Clear form
document.getElementById('workoutDuration').value =";

//Show success message
showNotification('Great job! ${type} workout logged successfully! 🎉');

//Calculate calories burned
function calculateCalories(type, duration, intensity) {
  const baseCalories = {
    cardio: 8,
    strength: 6,
    yoga: 3,
    running: 10, 
    cycling: 9,
    swimming: 11
  };

  const intensityMultiplier = {
    low: 0.8,
    moderate: 1.0,
    high: 1.0,
  };

  return Math.round(baseCalories[type] * duration * intensityMultiplier[intensity]);
}

//Update workout log display
function updateWorkoutLog() {
  const logContainer = document.getElementById('workoutLog');
  const recentWorkouts = workouts.slice(-5).reverse();

  logContainer.innerHTML = recentWorkouts.map(workout => `
    <div class="workout-entry">
    <div>
    <strong>${workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</stong><br>
    <small>${workout.date} • ${workout.duration} min • ${workout.calories}
    call</small>
    </div>
    <div style="font-size:1.2em;">
    ${getIntensityEmoji(workout.intensity)}
    </div>
    </div>
    `).join('');
}

//Get emoji for intensity level
function getIntensityEmoji(intensity) {
  const emojis = { low: '😌', moderate: '😤', high: '🔥' };
  return emojis[intensity] ||'😌';
}

//Update statistics display
function updateStats() {
  document.getElementById('totalWorkouts').textContent = totalStats.workouts;
  document.getElementById('totalMinutes').textContent = totalStats.minutes;
  document.getElementById('caloriesBurned').textContent = totalStats.calories;
  document.getElementById('currentStreak').textContent = calculateStreak();

  const thisWeek = getThisWeekWorkouts();
  document.getElementById('weeklyProgress').textContent = `${thisWeek}/5`;
  document.getElementById('weeklyBar').style.width = `${Math.min((thisWeek/5) * 100, 100)}%`;
}

//Calculate workout streak
function calculateStreak() {
  if (workout.length === 0) return 0;

  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  for (let i=0; i < 30; i++) {
    const dateString = currentDate.toLocateDateString();
    const hasWorkout = workout.some(w => w.date === dateString);

    if(hasWorkout) {
      streak ++;
    } else if (i>0) {
      break;
    }

    currentDate.setDate(currentDate.getDate() -1);
    }
    return streak;
  }

//Get this week's workouts
function getThisWeekWorkouts() {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  return workouts.filter(w => new Date(w.timestamp) >= startOfWeek).length;
}

//Initialize chart
let chart;
function initChart() {
const ctx = document.getElementById('progressChart').getContext('2d');
chart = new chart(ctx, {
type: 'line',
data: {
  labels: [],
  datasets: [{
    label: 'Calories Burned',
    data: [],
    borderColor: ' #667eea ',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    tension: 0.4,
    fill: true
  }]
},

options: {
  responsive: true,
  maintainAspectRatio:false,
  plugins : {
    legend: {
      display: true,
      position: 'top'
    }
},

scales: {
  y: {
    beginAtZero: true,
    title: {
      display: true,
      text: 'Calories'
    }
  },
x: {
  display:true, 
  text: 'Last 7 Days'
}
}
}
}

});
updateChart();

}

//Update progress chart with recent data
function updateChart() {
  const last7Days = [];
  const caloriesData = [];
  const today = new Date();

  for (let i = 6, i >=0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() -i);
    last7Days.push(date.toLocateDateString('en-US', {month: 'short', day: 'numeric'}));

    const dayCalories = workouts
    .filter(w=> w.date === dateString)
    .reduce((sum, w) => sum + w.calories, 0);

    caloriesData.push(dayCalories);
  }

  chart.data.labels = last7Days;
  chart.data.datasets[0].data = caloriesData;
  chart.update();

}

//BMI Calculator
function calculateBMI() {
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);

if (!weight || !height) {
  alert('Please enter both weight and height!');
  return;
}

const heightInMeters = height /100;
const bmi = weight / (heightInMeters * heightInMeters);
const resultDiv = document.getElementById('bmiResult');

let category, color, advice;

if (bmi < 18.5) {
  category = 'Underweight';
  color = '#3498db';
  advice = 'Consider consulting a healthcare professional about healthy weight gain strategies.';
} else if (bmi < 25) {
  category = 'Normal Weight';
  color = '#27ae60';
  advice = 'Great! Maintain your healthy lifestyle with regular exercise and balanced nutrition.';

}else if (bmi < 30){
  category = 'Overweight';
  color = '#f39c12';
  advice = 'Consider increasing physical activity and reviewing your diet with healthcare professional.';

} else{
  category = 'Obese';
  color = '#e74c3c';
  advice = 'Please consult with a healthcare professional for a personalised weight management plan.';
}

resultDiv.innerHTML = `
<div style ="background-color: ${color}; color:white;">
<h4>Your BMI: ${bmi.toFixed(1)}</h4>
<p><stong>Category:</strong></p>
</div>

`;

}

//Nutrition lookup function
async function searchNutrition() {
  const query = document.getElementById('foodQuery').value.trim();
  const resultDiv = document.getElementById('nutritionResults');

  if (!query) {
    alert('Please enter a food item to search!');
    return;
  }
resultDiv.innerHTML = '<div class = "loading">Searching nutrition data...</div>';

//Simulate API call mock data
setTimeout(() => {
  const mockNutritionData = generateMockNutritionData(query);
  displayNutritionResults(mockNutritionData);
},1000);
}

//Generate mock nutrition data
function generateMockNutritionData(query) {
const foods = {
  'apple': {calories: 52, protein:0.3, carbs: 14, fat 0.2, fiber: 2.4},
  'chicken breast': {calories: 165, protein:31, carbs: 0, fat: 3.6, fiber: 0},
  'oatmeal': {calories: 68, protein:2.4, carbs: 12, fat: 1.4, fiber: 1.7},
  'banana' : {calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6},
  'salmon' : {calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0},
  'broccoli' : {calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6},
  'rice' : {calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4},
   'egg' : {calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0},
};

const searchKey = Object.keys(foods).find(key =>
  query.toLowerCase().includes(key) || key.includes(query.toLowerCase())
);

return searchKey? {name: searchKey, ...foods[searchKey]}:
{name: query, calories:100, protein:5, carbs:15, fat:3, fiber:2};
}

//Display nuturition results
function displayNutritionResults(data) {
  const resultDiv = document.getElementById('nutritionResults');
  resultDiv.innerHTML = `
  <div class="food-item">
  <h4>${data.name.charAt(0).toUpperCase() + data.name.slice(1)} (per 100g)</h4>
  <div style="display:grid;grid-template-columns:repeat(2, 1fr); gap: 10px;
  margin-top: 10px;">

  <div>🔥Calories: ${data.calories}</div>
  <div>💪Protein: ${data.protein}g</div>
  <div>🍞Carbs: ${data.carbs}g</div>
  <div>🥑Fat: ${data.fat}g</div>
  <div>🌾Fiber: ${data.fiber}g</div>
  <div>⚡Energy: ${Math.round(data.calories * 4. 184)}kj</div>
  </div>
  </div>
  `;
}

//Achievement system
function checkAchievements() {
const newAchievements = [];

if (totalStats.workouts >= 1 &&!achievements.includes('first_workout')) {
  newAchievements.push({id: 'first_workout', name:' 🎯 First Step', desc: 'Completed your first workout!'});
}

if (totalStats.workouts >=5 &&!achievements.includes('consistent')) {
  newAchievements.push({id:'consistent', name: '🔥Getting Consistent',desc:'5 workouts completed!'});
}

if(totalStats.workouts >= 10 &&! achievements.includes('dedicated')) {
  newAchievements.push({id: 'dedicated', name: '💪 Dedicated', desc: '10 workouts completed!'});
}

if(totalStats.workouts >= 60 &&! achievements.includes('hour_power')) {
  newAchievements.push({id: 'hour_power', name: '⏰ Hour Power', desc: '60+ minutes of exercise!'});
}

if(totalStats.workouts >= 300 &&! achievements.includes('time_warrior')) {
  newAchievements.push({id: 'time_warrior', name: '⚔️  Time Warrior', desc: '5+ hours of exercise!'});
}

if(totalStats.workouts >= 500 &&! achievements.includes('calorie_crusher')) {
  newAchievements.push({id: 'calorie_crusher', name: '🔥 Calorie Crusher', desc: '500+ calories burned!'});
}

if(totalStats.workouts >= 1000 &&! achievements.includes('burn_master')) {
  newAchievements.push({id: 'burn_master', name: '🚀 Burn Master', desc: '1000+ calories burned'});
}

const currentStreak = calculateStreak();
if (currentStreak >= 3 &&!achievements.includes('streak_starter')) {
  newAchievements.push({id: 'streak_starter', name: '📅Streak Starter', desc: '3-day workout streak!'});
}

if (currentStreak >= 7 &&!achievements.includes('week_warrior')) {
  newAchievements.push({id: 'week_warrior', name: ' 👑Week Warrior', desc: '7-day workout streak!'});
}

newAchievements.forEach(achievement => {
achievements.push(achievement.id);
showNotification(`🏆Achievements Unlocked: ${achievement.name}!`);
});

updateAchievementDisplay();
saveData();
}

}


}


}