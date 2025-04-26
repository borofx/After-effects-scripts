// BeatMarker.jsx
// After Effects script to detect beats and place markers with enhanced features

(function () {
    // Create the UI
    var window = new Window("dialog", "Beat Marker Pro");
    window.orientation = "column";
    window.alignChildren = ["fill", "top"];
    window.spacing = 10;
    window.margins = 16;
    
    // Main tabs
    var tabbedPanel = window.add("tabbedpanel");
    tabbedPanel.alignChildren = ["fill", "fill"];
    
    // Basic tab
    var basicTab = tabbedPanel.add("tab", undefined, "Basic");
    basicTab.alignChildren = ["fill", "top"];
    basicTab.margins = 10;
    
    // Advanced tab
    var advancedTab = tabbedPanel.add("tab", undefined, "Advanced");
    advancedTab.alignChildren = ["fill", "top"];
    advancedTab.margins = 10;
    
    // Visualization tab
    var visualizationTab = tabbedPanel.add("tab", undefined, "Visualization");
    visualizationTab.alignChildren = ["fill", "top"];
    visualizationTab.margins = 10;
    
    tabbedPanel.selection = basicTab;

    // ----- BASIC TAB -----
    
    // Audio Layer selection
    var layerGroup = basicTab.add("group");
    layerGroup.add("statictext", undefined, "Audio Layer:");
    var layerDropdown = layerGroup.add("dropdownlist");
    layerDropdown.alignment = ["fill", "center"];

    // Sensitivity slider
    var sensitivityGroup = basicTab.add("group");
    sensitivityGroup.add("statictext", undefined, "Sensitivity:");
    var sensitivitySlider = sensitivityGroup.add("slider", undefined, 50, 10, 100);
    var sensitivityValue = sensitivityGroup.add("statictext", undefined, "50%");
    sensitivitySlider.alignment = ["fill", "center"];
    sensitivitySlider.onChanging = function () {
        sensitivityValue.text = Math.round(sensitivitySlider.value) + "%";
    };

    // Minimum beat interval
    var intervalGroup = basicTab.add("group");
    intervalGroup.add("statictext", undefined, "Min Interval (frames):");
    var intervalSlider = intervalGroup.add("slider", undefined, 3, 1, 15);
    var intervalValue = intervalGroup.add("statictext", undefined, "3");
    intervalSlider.alignment = ["fill", "center"];
    intervalSlider.onChanging = function () {
        intervalValue.text = Math.round(intervalSlider.value).toString();
    };

    // Marker type
    var markerTypeGroup = basicTab.add("group");
    markerTypeGroup.add("statictext", undefined, "Marker Type:");
    var markerType = markerTypeGroup.add("dropdownlist");
    markerType.add("item", "Composition Markers");
    markerType.add("item", "Layer Markers");
    markerType.selection = 0;
    markerType.alignment = ["fill", "center"];
    
    // ----- ADVANCED TAB -----
    
    // Detection method
    var detectionMethodGroup = advancedTab.add("panel", undefined, "Detection Method");
    detectionMethodGroup.alignChildren = ["fill", "top"];
    
    var detectionMethods = detectionMethodGroup.add("group");
    var simpleRadio = detectionMethods.add("radiobutton", undefined, "Simple Amplitude");
    var fftRadio = detectionMethods.add("radiobutton", undefined, "Frequency Analysis");
    simpleRadio.value = true;
    
    // Frequency range for detection (only enabled when FFT is selected)
    var freqRangeGroup = detectionMethodGroup.add("group");
    freqRangeGroup.enabled = false;
    freqRangeGroup.add("statictext", undefined, "Frequency Range:");
    var freqRangeDropdown = freqRangeGroup.add("dropdownlist");
    freqRangeDropdown.add("item", "Full Spectrum");
    freqRangeDropdown.add("item", "Bass (20-250Hz)");
    freqRangeDropdown.add("item", "Mid (250-2000Hz)");
    freqRangeDropdown.add("item", "High (2000-20000Hz)");
    freqRangeDropdown.selection = 0;
    
    fftRadio.onClick = function() {
        freqRangeGroup.enabled = true;
    };
    
    simpleRadio.onClick = function() {
        freqRangeGroup.enabled = false;
    };
    
    // Marker customization
    var markerCustomizationPanel = advancedTab.add("panel", undefined, "Marker Customization");
    markerCustomizationPanel.alignChildren = ["fill", "top"];
    
    // Marker color
    var markerColorGroup = markerCustomizationPanel.add("group");
    markerColorGroup.add("statictext", undefined, "Marker Color:");
    var markerColorDropdown = markerColorGroup.add("dropdownlist");
    markerColorDropdown.add("item", "Red");
    markerColorDropdown.add("item", "Green");
    markerColorDropdown.add("item", "Blue");
    markerColorDropdown.add("item", "Yellow");
    markerColorDropdown.add("item", "Cyan");
    markerColorDropdown.add("item", "Magenta");
    markerColorDropdown.selection = 0;
    
    // Marker naming pattern
    var markerNamingGroup = markerCustomizationPanel.add("group");
    markerNamingGroup.add("statictext", undefined, "Naming Pattern:");
    var markerNamingDropdown = markerNamingGroup.add("dropdownlist");
    markerNamingDropdown.add("item", "Beat #");
    markerNamingDropdown.add("item", "Beat at [time]");
    markerNamingDropdown.add("item", "Custom...");
    markerNamingDropdown.selection = 0;
    
    var customNamingGroup = markerCustomizationPanel.add("group");
    customNamingGroup.add("statictext", undefined, "Custom Name:");
    var customNamingInput = customNamingGroup.add("edittext", undefined, "Beat");
    customNamingInput.alignment = ["fill", "center"];
    customNamingGroup.enabled = false;
    
    markerNamingDropdown.onChange = function() {
        if (markerNamingDropdown.selection.index === 2) {
            customNamingGroup.enabled = true;
        } else {
            customNamingGroup.enabled = false;
        }
    };
    
    // Beat categorization
    var categorizationPanel = advancedTab.add("panel", undefined, "Beat Categorization");
    categorizationPanel.alignChildren = ["fill", "top"];
    
    var enableCategorizationCheckbox = categorizationPanel.add("checkbox", undefined, "Categorize beats by intensity");
    
    var intensityGroup = categorizationPanel.add("group");
    intensityGroup.enabled = false;
    var lowThresholdGroup = intensityGroup.add("group");
    lowThresholdGroup.orientation = "column";
    lowThresholdGroup.add("statictext", undefined, "Low-Med Threshold:");
    var lowThreshold = lowThresholdGroup.add("slider", undefined, 30, 10, 90);
    
    var highThresholdGroup = intensityGroup.add("group");
    highThresholdGroup.orientation = "column";
    highThresholdGroup.add("statictext", undefined, "Med-High Threshold:");
    var highThreshold = highThresholdGroup.add("slider", undefined, 70, 10, 90);
    
    enableCategorizationCheckbox.onClick = function() {
        intensityGroup.enabled = enableCategorizationCheckbox.value;
    };
    
    // ----- VISUALIZATION TAB -----
    
    // Preview group
    var previewPanel = visualizationTab.add("panel", undefined, "Beat Preview");
    previewPanel.alignChildren = ["fill", "top"];
    
    var previewButtonGroup = previewPanel.add("group");
    var analyzePreviewButton = previewButtonGroup.add("button", undefined, "Analyze Without Placing Markers");
    
    // Canvas area for visualization
    var canvasGroup = previewPanel.add("group");
    canvasGroup.alignment = ["fill", "fill"];
    var canvas = canvasGroup.add("panel", undefined, "");
    canvas.alignment = ["fill", "fill"];
    canvas.preferredSize = [400, 150];
    
    // ----- Bottom Section (Common) -----
    
    // Presets group
    var presetPanel = window.add("panel", undefined, "Presets");
    presetPanel.alignChildren = ["fill", "top"];
    
    var presetGroup = presetPanel.add("group");
    var presetDropdown = presetGroup.add("dropdownlist");
    presetDropdown.add("item", "Default");
    presetDropdown.add("item", "Dance Music");
    presetDropdown.add("item", "Hip Hop");
    presetDropdown.add("item", "Rock");
    presetDropdown.selection = 0;
    presetDropdown.alignment = ["fill", "center"];
    
    var presetButtonGroup = presetPanel.add("group");
    var savePresetButton = presetButtonGroup.add("button", undefined, "Save Current Settings");
    var deletePresetButton = presetButtonGroup.add("button", undefined, "Delete Selected Preset");
    deletePresetButton.enabled = false;  // Can't delete default preset
    
    // Progress bar
    var progressBarGroup = window.add("group");
    progressBarGroup.alignment = ["fill", "top"];
    var progressBar = progressBarGroup.add("progressbar", undefined, 0, 100);
    progressBar.alignment = ["fill", "center"];
    
    // Status text
    var statusText = window.add("statictext", undefined, "Ready");
    statusText.alignment = ["fill", "bottom"];

    // Action buttons
    var buttonGroup = window.add("group");
    buttonGroup.alignment = ["fill", "top"];
    var analyzeButton = buttonGroup.add("button", undefined, "Analyze & Place Markers");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    // Initialize script
    function init() {
        populateLayerDropdown();
        loadPresets();
        
        analyzeButton.onClick = detectBeatsAndPlaceMarkers;
        analyzePreviewButton.onClick = previewBeats;
        cancelButton.onClick = function () { window.close(); };
        
        // Set up preset handlers
        presetDropdown.onChange = loadPresetSettings;
        savePresetButton.onClick = savePreset;
        deletePresetButton.onClick = deletePreset;
        
        window.show();
    }

    function loadPresets() {
        // This would load saved presets from a settings file
        // For now, we just define some defaults
        var presets = {
            "Default": {
                sensitivity: 50,
                interval: 3,
                markerType: 0,
                detectionMethod: "simple",
                freqRange: 0,
                markerColor: 0,
                markerNaming: 0
            },
            "Dance Music": {
                sensitivity: 60,
                interval: 4,
                markerType: 0,
                detectionMethod: "fft",
                freqRange: 1,  // Bass range
                markerColor: 2,
                markerNaming: 0
            },
            "Hip Hop": {
                sensitivity: 70,
                interval: 5,
                markerType: 0,
                detectionMethod: "fft",
                freqRange: 1,  // Bass range
                markerColor: 5,
                markerNaming: 0
            },
            "Rock": {
                sensitivity: 55,
                interval: 3,
                markerType: 0,
                detectionMethod: "simple",
                freqRange: 0,
                markerColor: 3,
                markerNaming: 0
            }
        };
        
        // Store presets in a global variable for the script
        window.presets = presets;
    }
    
    function loadPresetSettings() {
        var presetName = presetDropdown.selection.text;
        var preset = window.presets[presetName];
        
        if (!preset) return;
        
        // Apply the preset settings
        sensitivitySlider.value = preset.sensitivity;
        sensitivityValue.text = preset.sensitivity + "%";
        
        intervalSlider.value = preset.interval;
        intervalValue.text = preset.interval.toString();
        
        markerType.selection = preset.markerType;
        
        if (preset.detectionMethod === "simple") {
            simpleRadio.value = true;
            freqRangeGroup.enabled = false;
        } else {
            fftRadio.value = true;
            freqRangeGroup.enabled = true;
        }
        
        freqRangeDropdown.selection = preset.freqRange;
        markerColorDropdown.selection = preset.markerColor;
        markerNamingDropdown.selection = preset.markerNaming;
        
        // Enable/disable delete button based on whether this is a default preset
        deletePresetButton.enabled = (presetName !== "Default");
    }
    
    function savePreset() {
        var presetName = prompt("Enter a name for this preset:", "My Preset");
        if (!presetName) return;
        
        // Save current settings as a preset
        var newPreset = {
            sensitivity: Math.round(sensitivitySlider.value),
            interval: Math.round(intervalSlider.value),
            markerType: markerType.selection.index,
            detectionMethod: simpleRadio.value ? "simple" : "fft",
            freqRange: freqRangeDropdown.selection.index,
            markerColor: markerColorDropdown.selection.index,
            markerNaming: markerNamingDropdown.selection.index
        };
        
        window.presets[presetName] = newPreset;
        
        // Add to dropdown
        presetDropdown.add("item", presetName);
        presetDropdown.selection = presetDropdown.items.length - 1;
        
        // Enable delete button
        deletePresetButton.enabled = true;
        
        // In a real implementation, save to disk
        // savePresetsToFile();
    }
    
    function deletePreset() {
        var presetName = presetDropdown.selection.text;
        if (presetName === "Default") return;  // Can't delete default
        
        if (confirm("Are you sure you want to delete the preset '" + presetName + "'?")) {
            delete window.presets[presetName];
            
            // Remove from dropdown
            presetDropdown.remove(presetDropdown.selection);
            presetDropdown.selection = 0;  // Select Default
            
            // In a real implementation, save to disk
            // savePresetsToFile();
        }
    }

    function populateLayerDropdown() {
        layerDropdown.removeAll();

        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            layerDropdown.add("item", "No composition selected");
            analyzeButton.enabled = false;
            analyzePreviewButton.enabled = false;
            return;
        }

        var hasAudioLayers = false;
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            if (layer.hasAudio) {
                layerDropdown.add("item", i + ": " + layer.name);
                hasAudioLayers = true;
            }
        }

        if (!hasAudioLayers) {
            layerDropdown.add("item", "No audio layers found");
            analyzeButton.enabled = false;
            analyzePreviewButton.enabled = false;
        } else {
            layerDropdown.selection = 0;
            analyzeButton.enabled = true;
            analyzePreviewButton.enabled = true;
        }
    }
    
    function previewBeats() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        if (!layerDropdown.selection) {
            alert("Please select an audio layer.");
            return;
        }

        var layerIndex = parseInt(layerDropdown.selection.text.split(":")[0]);
        var layer = comp.layer(layerIndex);

        statusText.text = "Analyzing audio for preview...";
        progressBar.value = 0;
        window.update();

        try {
            // Run "Convert Audio to Keyframes" temporarily
            app.beginUndoGroup("Audio Analysis for Preview");
            layer.selected = true;
            app.executeCommand(app.findMenuCommandId("Convert Audio to Keyframes"));

            // Get the generated "Audio Amplitude" layer
            var ampLayer = comp.layer("Audio Amplitude");
            if (!ampLayer) {
                alert("Could not generate Audio Amplitude layer.");
                return;
            }

            var ampProp;
            
            if (fftRadio.value && app.version >= 17.0) {
                // For FFT mode, we would ideally use audio spectrum data
                // This is a placeholder for actual FFT implementation
                ampProp = ampLayer.property("Effects").property("Both Channels").property("Slider");
            } else {
                ampProp = ampLayer.property("Effects").property("Both Channels").property("Slider");
            }
            
            if (!ampProp) {
                alert("Missing amplitude property.");
                return;
            }

            // Sample audio levels
            var frameRate = comp.frameRate;
            var frameDuration = 1 / frameRate;
            var totalFrames = Math.floor(comp.duration * frameRate);
            var audioLevels = [];

            for (var frame = 0; frame < totalFrames; frame++) {
                var t = frame * frameDuration;
                var val = ampProp.valueAtTime(t, false);

                audioLevels.push({
                    time: t,
                    level: val
                });

                if (frame % 10 === 0) {
                    progressBar.value = Math.round(frame / totalFrames * 100);
                    window.update();
                }
            }

            // Remove Audio Amplitude layer (cleanup)
            ampLayer.remove();
            app.endUndoGroup();

            // Beat detection
            var sensitivity = sensitivitySlider.value / 100;
            var minIntervalFrames = Math.round(intervalSlider.value);
            var beats = detectBeats(audioLevels, sensitivity, minIntervalFrames * frameDuration);

            // Draw beats on the canvas
            drawBeatsVisualization(canvas, audioLevels, beats, comp.duration);

            statusText.text = "Found " + beats.length + " beats";
            progressBar.value = 100;
            
        } catch (err) {
            app.endUndoGroup();
            alert("Error: " + err.toString());
            statusText.text = "Error during analysis";
        }
    }
    
    function drawBeatsVisualization(canvas, audioLevels, beats, duration) {
        // This function would draw a waveform with beat markers on the canvas
        // Since we can't actually draw in ScriptUI easily, this is a placeholder
        
        var g = canvas.graphics;
        g.clear();
        
        // In a real implementation, we'd draw the waveform and beats here
        // For now, just update the canvas title with beat info
        canvas.text = beats.length + " beats detected in " + duration.toFixed(2) + " seconds";
    }

    function detectBeatsAndPlaceMarkers() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        if (!layerDropdown.selection) {
            alert("Please select an audio layer.");
            return;
        }

        var layerIndex = parseInt(layerDropdown.selection.text.split(":")[0]);
        var layer = comp.layer(layerIndex);

        statusText.text = "Analyzing audio...";
        progressBar.value = 0;
        window.update();

        app.beginUndoGroup("Detect Beats & Place Markers");

        try {
            // Run "Convert Audio to Keyframes"
            layer.selected = true;
            app.executeCommand(app.findMenuCommandId("Convert Audio to Keyframes"));

            // Get the generated "Audio Amplitude" layer
            var ampLayer = comp.layer("Audio Amplitude");
            if (!ampLayer) {
                alert("Could not generate Audio Amplitude layer.");
                return;
            }

            var ampProp;
            if (fftRadio.value && app.version >= 17.0) {
                // This is a placeholder for actual FFT implementation
                // In a real implementation, we would use FFT data from the audio
                ampProp = ampLayer.property("Effects").property("Both Channels").property("Slider");
            } else {
                ampProp = ampLayer.property("Effects").property("Both Channels").property("Slider");
            }
            
            if (!ampProp) {
                alert("Missing amplitude property.");
                return;
            }

            // Sample audio levels
            var frameRate = comp.frameRate;
            var frameDuration = 1 / frameRate;
            var totalFrames = Math.floor(comp.duration * frameRate);
            var audioLevels = [];

            for (var frame = 0; frame < totalFrames; frame++) {
                var t = frame * frameDuration;
                var val = ampProp.valueAtTime(t, false);

                audioLevels.push({
                    time: t,
                    level: val
                });

                if (frame % 10 === 0) {
                    progressBar.value = Math.round(frame / totalFrames * 100);
                    window.update();
                }
            }

            // Remove Audio Amplitude layer (optional cleanup)
            ampLayer.remove();

            // Beat detection
            var sensitivity = sensitivitySlider.value / 100;
            var minIntervalFrames = Math.round(intervalSlider.value);
            var beats = detectBeats(audioLevels, sensitivity, minIntervalFrames * frameDuration);
            
            // Categorize beats by intensity if enabled
            if (enableCategorizationCheckbox.value) {
                categorizeBeatsByIntensity(beats, audioLevels, lowThreshold.value / 100, highThreshold.value / 100);
            }

            // Place markers
            placeMarkers(beats, comp, layer, markerType.selection.index);

            statusText.text = "Placed " + beats.length + " markers";
            progressBar.value = 100;
            
        } catch (err) {
            alert("Error: " + err.toString());
            statusText.text = "Error during analysis";
        } finally {
            app.endUndoGroup();
        }
    }

    function detectBeats(audioLevels, sensitivity, minInterval) {
        var beats = [];
        var windowSize = 5;  // Look at 5 frames before and after

        // Compute average level
        var sum = 0;
        for (var i = 0; i < audioLevels.length; i++) {
            sum += audioLevels[i].level;
        }
        var averageLevel = sum / audioLevels.length;
        var baseThreshold = averageLevel * (1 + sensitivity);
        var lastBeatTime = -minInterval;

        // For adaptive thresholding
        var recentLevels = [];
        var maxRecentLevelsSize = 30;  // Store the last 30 frames of data

        for (var i = windowSize; i < audioLevels.length - windowSize; i++) {
            // Store recent levels for adaptive thresholding
            recentLevels.push(audioLevels[i].level);
            if (recentLevels.length > maxRecentLevelsSize) {
                recentLevels.shift();  // Remove oldest
            }
            
            // Calculate local average
            sum = 0;
            for (var j = i - windowSize; j < i + windowSize; j++) {
                sum += audioLevels[j].level;
            }
            var localAverage = sum / (windowSize * 2);
            
            // Calculate adaptive threshold based on recent history
            var adaptiveThreshold = 0;
            if (recentLevels.length > 0) {
                var recentSum = 0;
                for (var k = 0; k < recentLevels.length; k++) {
                    recentSum += recentLevels[k];
                }
                var recentAverage = recentSum / recentLevels.length;
                adaptiveThreshold = recentAverage * (1 + sensitivity);
            }
            
            // Use the higher of base threshold, local threshold, or adaptive threshold
            var threshold = Math.max(baseThreshold, localAverage * (1 + sensitivity), adaptiveThreshold);

            var current = audioLevels[i];
            
            // Check if this is a local peak
            var isPeak = true;
            for (var j = i - windowSize; j < i + windowSize; j++) {
                if (j != i && audioLevels[j].level > current.level) {
                    isPeak = false;
                    break;
                }
            }

            if (
                current.level > threshold &&
                current.time - lastBeatTime >= minInterval &&
                isPeak
            ) {
                beats.push({
                    time: current.time,
                    level: current.level,
                    intensity: "medium"  // Default intensity, will be categorized later if enabled
                });
                lastBeatTime = current.time;
            }
        }

        return beats;
    }
    
    function categorizeBeatsByIntensity(beats, audioLevels, lowThreshold, highThreshold) {
        // Find the max level in the entire audio
        var maxLevel = 0;
        for (var i = 0; i < audioLevels.length; i++) {
            if (audioLevels[i].level > maxLevel) {
                maxLevel = audioLevels[i].level;
            }
        }
        
        // Categorize each beat
        for (var i = 0; i < beats.length; i++) {
            var normalizedLevel = beats[i].level / maxLevel;
            
            if (normalizedLevel < lowThreshold) {
                beats[i].intensity = "low";
            } else if (normalizedLevel < highThreshold) {
                beats[i].intensity = "medium";
            } else {
                beats[i].intensity = "high";
            }
        }
    }

    function placeMarkers(beats, comp, layer, markerTypeIndex) {
        // Clear old markers
        if (markerTypeIndex === 0) {
            while (comp.markerProperty.numKeys > 0) {
                comp.markerProperty.removeKey(1);
            }
        } else {
            while (layer.marker.numKeys > 0) {
                layer.marker.removeKey(1);
            }
        }

        // Set marker colors based on settings
        var colorMap = {
            0: 1,    // Red
            1: 2,    // Green
            2: 3,    // Blue
            3: 4,    // Yellow (actually cyan in AE)
            4: 5,    // Cyan (actually purple in AE)
            5: 6     // Magenta (actually pink in AE)
        };
        var selectedColor = colorMap[markerColorDropdown.selection.index] || 1;
        
        for (var i = 0; i < beats.length; i++) {
            var beat = beats[i];
            var markerName;
            
            // Generate marker name based on pattern selection
            switch (markerNamingDropdown.selection.index) {
                case 0:
                    markerName = "Beat " + (i + 1);
                    break;
                case 1:
                    var timeInSeconds = beat.time.toFixed(2);
                    markerName = "Beat at " + timeInSeconds + "s";
                    break;
                case 2:
                    markerName = customNamingInput.text + " " + (i + 1);
                    break;
            }
            
            // Add intensity if categorization is enabled
            if (enableCategorizationCheckbox.value) {
                markerName += " (" + beat.intensity + ")";
            }
            
            var marker = new MarkerValue(markerName);
            
            // Set marker color
            if (enableCategorizationCheckbox.value) {
                // Override color based on intensity
                switch (beat.intensity) {
                    case "low":
                        marker.label = 2;  // Green for low intensity
                        break;
                    case "medium":
                        marker.label = 4;  // Yellow (cyan in AE) for medium intensity
                        break;
                    case "high":
                        marker.label = 1;  // Red for high intensity
                        break;
                }
            } else {
                marker.label = selectedColor;
            }
            
            // Add comment with additional info
            marker.comment = "Level: " + beat.level.toFixed(2);
            
            // Place the marker
            if (markerTypeIndex === 0) {
                comp.markerProperty.setValueAtTime(beat.time, marker);
            } else {
                layer.marker.setValueAtTime(beat.time, marker);
            }
        }
    }

    init();
})();