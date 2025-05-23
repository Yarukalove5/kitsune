import "sumo/js/libs/jquery.lazyload";
import {
  getQueryParamsAsDict,
  getReferrer,
  getSearchQuery,
} from "sumo/js/main";
import ShowFor from "sumo/js/showfor";

new ShowFor();

addReferrerAndQueryToVoteForm();
determineLazyLoad();


// The "DOMContentLoaded" event is guaranteed not to have been
// called by the time the following code is run, because it always
// waits until all deferred scripts have been loaded, and the code
// in this file is always bundled into a script that is deferred.
document.addEventListener("DOMContentLoaded", async () => {
  positionVotingBasedOnScreenWidth();

  // Once the DOM is ready, replace the value of any hidden form input
  // elements holding a CSRF token with a dynamically fetched token.
  // We do this because article pages are cached, so the CSRF token
  // values delivered on page load are typically invalid. Note that
  // the response from the fetch also sets the "csrftoken" cookie, if
  // it hasn't already been set, or if it has, resets its expiry date.
  const matches = document.querySelectorAll(
    'form > input[name="csrfmiddlewaretoken"]'
  );
  if (matches.length > 0) {
    try {
      const response = await fetch("/csrftoken");
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      matches.forEach((element) => {
        element.setAttribute("value", data.csrfToken)
      });
    } catch (err) {
      console.error(err);
    }
  }

  document.querySelectorAll(".is-summary button").forEach(button => {
    button.addEventListener("click", function () {
      let wrapper = this.closest(".is-summary").nextElementSibling;
      let is_expanded = this.getAttribute("aria-expanded") === "true";

      if (is_expanded) {
        wrapper.querySelectorAll("img.lazy").forEach(img => {
          let src = img.getAttribute("data-original-src");
          if (src) {
            img.setAttribute("src", src);
            img.classList.remove("lazy");
            img.removeAttribute("data-original-src");
          }
        });
      }
    });
  });

});

function positionVotingBasedOnScreenWidth() {
  const wideScreenWrapper = document.getElementById("document-vote-wrapper-wide-screen");
  const narrowScreenWrapper = document.getElementById("document-vote-wrapper-narrow-screen");
  // The vote form is initially loaded in the wide-screen wrapper.
  const vote = wideScreenWrapper.querySelector("div.document-vote");

  if (wideScreenWrapper && narrowScreenWrapper && vote) {
    function handleScreenResize(event) {
      if (event.matches) {
        // The screen is too narrow for two columns, so
        // move voting to the narrow-screen container.
        if (!narrowScreenWrapper.contains(vote)) {
          narrowScreenWrapper.appendChild(vote);
        }
      } else {
        // The screen is wide enough for two columns, so
        // move voting to the wide-screen container.
        if (!wideScreenWrapper.contains(vote)) {
          wideScreenWrapper.appendChild(vote);
        }
      }
    }

    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    // Listen for screen width changes.
    mediaQuery.addEventListener("change", handleScreenResize);

    // Handle the current screen width.
    handleScreenResize(mediaQuery);
  }
}

$(window).on("load", function () {
  // Wait for all content (including images) to load
  var hash = window.location.hash;
  if (hash) {
    window.location.hash = ""; // Clear the hash initially
    setTimeout(function () {
      window.location.hash = hash; // Restore the hash after all images are loaded
    }, 0);
  }
}
);

// For this singular document, we are going to load
// all images without lazy loading
// TODO: We need a fix for the whole KB that won't
// break the lazy loading.
function determineLazyLoad() {
  if (window.location.href.indexOf("relay-integration") > -1) {
    $("img.lazy").loadnow(); // Load all images
  }
  else {
    $("img.lazy").lazyload();
  }
};

function addReferrerAndQueryToVoteForm() {
  // Add the source/referrer and query terms to the helpful vote form
  var urlParams = getQueryParamsAsDict(),
    referrer = getReferrer(urlParams),
    query = getSearchQuery(urlParams, referrer);
  $(".document-vote form")
    .append($('<input type="hidden" name="referrer"/>').attr("value", referrer))
    .append($('<input type="hidden" name="query"/>').attr("value", query));
};
