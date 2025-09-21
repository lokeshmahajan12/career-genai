import * as tf from "@tensorflow/tfjs";  // ✅ फक्त node version

let model;

export async function buildModel() {
  model = tf.sequential();

  model.add(tf.layers.dense({ inputShape: [10], units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 5, activation: "softmax" }));

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}

export async function trainModel() {
  if (!model) await buildModel();

  const xs = tf.randomNormal([100, 10]);
  const ys = tf.oneHot(
    tf.tensor1d(Array.from({ length: 100 }, () => Math.floor(Math.random() * 5)), "int32"),
    5
  );

  await model.fit(xs, ys, { epochs: 20, batchSize: 8 });
  console.log("✅ Model trained!");
}

export function predictCareer(inputArray) {
  if (!model) throw new Error("Model not initialized — call buildModel() first");

  const inputTensor = tf.tensor2d([inputArray]);
  const prediction = model.predict(inputTensor);

  const result = prediction.argMax(-1).dataSync()[0];
  return result;
}
