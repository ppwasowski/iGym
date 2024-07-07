const getWorkoutMessage = (lastWorkoutDate) => {
  const today = new Date();
  const lastWorkout = new Date(lastWorkoutDate);
  const diffTime = Math.abs(today - lastWorkout);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) {
    return "Excellent consistency, keep up the good work! Your last workout was: " + diffDays + " days ago";
  } else if (diffDays <= 5) {
    return "Not bad, but don't forget to find some time to exercise! Your last workout was: " + diffDays + " days ago";
  } else {
    return "It's time to get back to work! Your last workout was: " + diffDays + " days ago";
  }
};

export default getWorkoutMessage;
