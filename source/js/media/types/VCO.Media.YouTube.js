/*	VCO.Media.YouTube
================================================== */

VCO.Media.YouTube = VCO.Media.extend({

	includes: [VCO.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this,
			url_vars;

		// Loading Message
		this.loadingMessage();

		this.youtube_loaded = false;

		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-youtube vco-media-shadow", this._el.content);
		this._el.content_item.id = VCO.Util.unique_ID(7)

		// URL Vars
		url_vars = VCO.Util.getUrlVars(this.data.url);

		// Get Media ID
		this.media_id = {};

		if (this.data.url.match('v=')) {
			this.media_id.id	= url_vars["v"];
		} else if (this.data.url.match('\/embed\/')) {
			this.media_id.id	= this.data.url.split("embed\/")[1].split(/[?&]/)[0];
		} else if (this.data.url.match(/v\/|v=|youtu\.be\//)){
			this.media_id.id	= this.data.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
		} else {
			trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");
		}

		this.media_id.start		= VCO.Util.parseYouTubeTime(url_vars["t"]);
		this.media_id.hd		= Boolean(typeof(url_vars["hd"]) != 'undefined');


		// API Call
		VCO.Load.js('https://www.youtube.com/player_api', function() {
			self.createMedia();
		});

	},

	// Update Media Display
	_updateMediaDisplay: function() {
		//this.el.content_item = document.getElementById(this._el.content_item.id);
		this._el.content_item.style.height = VCO.Util.ratio.r16_9({w:this.options.width}) + "px";
		this._el.content_item.style.width = this.options.width + "px";
	},

	_stopMedia: function() {
		if (this.youtube_loaded) {
			try {
				this.player.pauseVideo();
			}
			catch(err) {
				trace(err);
			}

		}
	},
	createMedia: function() {
		var self = this;

		clearTimeout(this.timer);

		if(typeof YT != 'undefined' && typeof YT.Player != 'undefined') {
			// Create Player
			this.player = new YT.Player(this._el.content_item.id, {
				playerVars: {
					enablejsapi:		1,
					color: 				'white',
					autohide: 			1,
					showinfo:			0,
					theme:				'light',
					start:				this.media_id.start,
					fs: 				0,
					rel:				0
				},
				videoId: this.media_id.id,
				events: {
					onReady: 			function() {
						self.onPlayerReady();
						// After Loaded
						self.onLoaded();
					},
					'onStateChange': 	self.onStateChange
				}
			});
		} else {
			this.timer = setTimeout(function() {
				self.createMedia();
			}, 1000);
		}
	},

	/*	Events
	================================================== */
	onPlayerReady: function(e) {
		this.youtube_loaded = true;
		this._el.content_item = document.getElementById(this._el.content_item.id);
		this.onMediaLoaded();

	},

	onStateChange: function(e) {

	}


});
