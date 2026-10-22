const $ = (id) => document.getElementById(id);

const form = $("form");
const input = $("object");
const go = $("go");
const errorBox = $("error");

let currentLabel = null;

input.addEventListener("input", () => {
  $("count").textContent = `${input.value.length} / ${input.maxLength}`;
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data = {};
  try {
    data = await res.json();
  } catch (_) {
    /* non-JSON response (e.g. a gateway timeout) */
  }
  if (!res.ok) {
    const err = new Error(data.error || "Something went wrong. Please try again.");
    err.data = data;
    throw err;
  }
  return data;
}

function resetStage() {
  $("stage").hidden = false;
  $("label").hidden = true;
  $("labelStatus").hidden = false;
  $("labelStatus").textContent = "Writing the wall label…";
  $("art").hidden = true;
  $("art").removeAttribute("src");
  $("frameStatus").hidden = false;
  $("frameStatus").textContent = "Installing the work…";
  $("promptBox").hidden = true;
}

function renderLabel(l) {
  // textContent (not innerHTML) so model output can never inject markup.
  $("tArtist").textContent = l.artist_name;
  $("tBio").textContent = l.artist_bio;
  $("tTitle").textContent = l.title;
  $("tYear").textContent = l.year;
  $("tMedium").textContent = l.medium;
  $("tDims").textContent = l.dimensions;
  $("tProv").textContent = l.provenance;
  $("tCredit").textContent = l.credit_line;
  $("tExtended").textContent = l.extended_label.replace(/\*/g, "");
  $("labelStatus").hidden = true;
  $("label").hidden = false;
}

async function loadImage() {
  $("frameStatus").hidden = false;
  $("frameStatus").textContent = "Installing the work…";
  $("art").hidden = true;
  const data = await postJSON("/api/image", { label: currentLabel });
  const src = data.image_b64
    ? `data:image/png;base64,${data.image_b64}`
    : data.image_url;
  const art = $("art");
  art.src = src;
  art.alt = `${currentLabel.title}, ${currentLabel.artist_name}: installation view`;
  art.hidden = false;
  $("frameStatus").hidden = true;
  $("imagePrompt").textContent = data.image_prompt;
  $("promptBox").hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const description = input.value.trim();
  if (!description) return;

  showError("");
  go.disabled = true;
  go.textContent = "Acquiring…";
  resetStage();
  $("stage").scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const { label } = await postJSON("/api/label", { object: description });
    currentLabel = label;
    renderLabel(label);
  } catch (err) {
    $("stage").hidden = true;
    showError(err.message);
    go.disabled = false;
    go.textContent = "Hang it in the gallery";
    return;
  }

  try {
    await loadImage();
  } catch (err) {
    $("frameStatus").textContent = err.message + " Press the button again to retry.";
    showError(err.message);
  } finally {
    go.disabled = false;
    go.textContent = "Hang it in the gallery";
  }
});