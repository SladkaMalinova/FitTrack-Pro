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

}


}


}