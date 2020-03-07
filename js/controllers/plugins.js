import { loadScript } from './../utils/util.js'

/**
 * Manages loading and registering of reveal.js plugins.
 */
export default class Plugins {

	constructor() {

		// Flags our current state (pending -> loading -> loaded)
		this.state = 'pending';

		// An id:instance map of currently registed plugins
		this.registeredPlugins = {};

		this.asyncDependencies = [];

	}

	/**
	 * Loads the dependencies of reveal.js. Dependencies are
	 * defined via the configuration option 'dependencies'
	 * and will be loaded prior to starting/binding reveal.js.
	 * Some dependencies may have an 'async' flag, if so they
	 * will load after reveal.js has been started up.
	 */
	load( dependencies ) {

		this.state = 'loading';

		return new Promise( resolve => {

			let scripts = [],
				scriptsToLoad = 0;

			dependencies.forEach( s => {
				// Load if there's no condition or the condition is truthy
				if( !s.condition || s.condition() ) {
					if( s.async ) {
						this.asyncDependencies.push( s );
					}
					else {
						scripts.push( s );
					}
				}
			} );

			if( scripts.length ) {
				scriptsToLoad = scripts.length;

				// Load synchronous scripts
				scripts.forEach( s => {
					loadScript( s.src, () => {

						if( typeof s.callback === 'function' ) s.callback();

						if( --scriptsToLoad === 0 ) {
							this.initPlugins().then( resolve );
						}

					} );
				} );
			}
			else {
				this.initPlugins().then( resolve );
			}

		} );

	}

	/**
	 * Initializes our plugins and waits for them to be ready
	 * before proceeding.
	 */
	initPlugins() {

		return new Promise( resolve => {

			let pluginsToInitialize = Object.keys( this.registeredPlugins ).length;

			// If there are no plugins, skip this step
			if( pluginsToInitialize === 0 ) {
				this.loadAsync().then( resolve );
			}
			// ... otherwise initialize plugins
			else {

				let afterPlugInitialized = () => {
					if( --pluginsToInitialize === 0 ) {
						this.loadAsync().then( resolve );
					}
				};

				for( let i in this.registeredPlugins ) {

					let plugin = this.registeredPlugins[i];

					// If the plugin has an 'init' method, invoke it
					if( typeof plugin.init === 'function' ) {
						let callback = plugin.init();

						// If the plugin returned a Promise, wait for it
						if( callback && typeof callback.then === 'function' ) {
							callback.then( afterPlugInitialized );
						}
						else {
							afterPlugInitialized();
						}
					}
					else {
						afterPlugInitialized();
					}

				}

			}

		} )

	}

	/**
	 * Loads all async reveal.js dependencies.
	 */
	loadAsync() {

		this.state = 'loaded';

		if( this.asyncDependencies.length ) {
			this.asyncDependencies.forEach( s => {
				loadScript( s.src, s.callback );
			} );
		}

		return Promise.resolve();

	}

	/**
	 * Registers a new plugin with this reveal.js instance.
	 *
	 * reveal.js waits for all regisered plugins to initialize
	 * before considering itself ready, as long as the plugin
	 * is registered before calling `Reveal.initialize()`.
	 */
	registerPlugin( id, plugin ) {

		if( this.registeredPlugins[id] === undefined ) {
			this.registeredPlugins[id] = plugin;

			// If a plugin is registered after reveal.js is loaded,
			// initialize it right away
			if( this.state === 'loaded' && typeof plugin.init === 'function' ) {
				plugin.init();
			}
		}
		else {
			console.warn( 'reveal.js: "'+ id +'" plugin has already been registered' );
		}

	}

	/**
	 * Checks if a specific plugin has been registered.
	 *
	 * @param {String} id Unique plugin identifier
	 */
	hasPlugin( id ) {

		return !!this.registeredPlugins[id];

	}

	/**
	 * Returns the specific plugin instance, if a plugin
	 * with the given ID has been registered.
	 *
	 * @param {String} id Unique plugin identifier
	 */
	getPlugin( id ) {

		return this.registeredPlugins[id];

	}

	getRegisteredPlugins() {

		return this.registeredPlugins;

	}

}