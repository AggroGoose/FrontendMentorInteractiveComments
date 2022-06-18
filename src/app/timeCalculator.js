export default function timeCalculator(time) {
  const currDate = Date.now();
  const value = currDate - time;
  let output;
  if (value < 120000) {
    output = "A minute ago";
  } else if (value < 600000) {
    output = "A few minutes ago";
  } else if (value < 1080000) {
    output = "10 minutes ago";
  } else if (value < 1620000) {
    output = "20 minutes ago";
  } else if (value < 2640000) {
    output = "30 minutes ago";
  } else if (value < 3600000) {
    output = "45 minutes ago";
  } else if (value < 7200000) {
    output = "An hour ago";
  } else if (value < 7200000) {
    output = "Two hours ago";
  } else if (value < 9600000) {
    output = "A few hours ago";
  } else if (value < 18000000) {
    output = "Several hours ago";
  } else if (value < 86400000) {
    output = "A day ago";
  } else if (value < 151200000) {
    output = "A couple days ago";
  } else if (value < 7200000) {
    output = "Several days ago";
  } else if (value < 500000000) {
    output = "A week ago";
  } else if (value < 2500000000) {
    output = "Over a week ago";
  } else if (value < 4500000000) {
    output = "A month ago";
  } else if (value > 4500000000) {
    output = "Over a month ago";
  }

  return output;
}
