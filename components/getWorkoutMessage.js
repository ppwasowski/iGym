const getWorkoutMessage = (lastWorkoutDate) => {
  const today = new Date();
  const lastWorkout = new Date(lastWorkoutDate);
  const diffTime = Math.abs(today - lastWorkout);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let consistency = "";
  let reminder = "";
  let color = "";
  let message = `Your last workout was: ${diffDays} days ago.`;

  if (diffDays <= 3) {
    consistency = "Excellent";
    reminder = "Keep up the good work!";
    color = "text-Primary"; 
  } else if (diffDays <= 5) {
    consistency = "Not bad";
    reminder = "Don't forget to find some time to exercise!";
    color = "text-Alter";
  } else {
    consistency = "Bad";
    reminder = "It's time to get back to work!";
    color = "text-red-500"; 
  }

  return { message, consistency, reminder, color, diffDays };
};

export default getWorkoutMessage;
