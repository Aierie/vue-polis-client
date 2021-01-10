<template>
  <iframe ref="polisFrame" v-bind="iframeVars"></iframe>
</template>

<script>
import polisProps from './config'
export default {
  props: polisProps,
  data() {
    return {
      polisUrl: 'https://pol.is',
      localHeight: null,
      localParentUrl: '',
      urlXid: '',
    }
  },
  computed: {
    iframeVars() {
      return {
        ...this.iframeUI,
        ...this.iframeLogicAttrs,
      }
    },
    iframeUI() {
      return {
        width: '100%',
        height: this.localHeight !== null ? this.localHeight : this.height,
        style: {
          maxWidth: this.availableWidth + 'px',
          border: this.border,
          borderRadius: this.border_radius,
          padding: this.padding,
          backgroundColor: 'white',
        },
      }
    },
    iframeLogicAttrs() {
      return {
        src: this.src,
        id: this.id,
      }
    },
    src() {
      return this.polisUrl + '/' + this.path + this.params
    },
    id() {
      if (this.conversation_id) return `polis_${this.conversation_id}`
      else if (this.site_id && this.page_id)
        return `polis_${this.site_id}_${this.page_id}`
      else return ''
    },
    path() {
      const path = []

      if (this.conversation_id) {
        if (this.demo) {
          path.push('demo')
        }
        path.push(this.conversation_id)
      } else if (this.site_id) {
        path.push(this.site_id)
        path.push(this.page_id)
      }

      return path.join('/')
    },
    params() {
      const backup = {
        parent_url: this.localParentUrl,
        xid: this.urlXid,
      }
      const paramStrings = []
      const appendIfPresent = (name) => {
        if (this[name] !== null && this[name] !== undefined) {
          paramStrings.push(name + '=' + encodeURIComponent(this[name]))
        } else if (backup[name]) {
          paramStrings.push(name + '=' + encodeURIComponent(backup[name]))
        }
      }

      if (!this.conversation_id && this.site_id) {
        appendIfPresent('demo')
      }

      appendIfPresent('parent_url')
      if (this.parent_url || backup.parent_url) {
        paramStrings.push('referrer=' + encodeURIComponent(document.referrer))
      }
      appendIfPresent('build')
      appendIfPresent('xid')
      appendIfPresent('x_name')
      appendIfPresent('x_profile_image_url')
      appendIfPresent('ucv')
      appendIfPresent('ucw')
      appendIfPresent('ucsh')
      appendIfPresent('ucst')
      appendIfPresent('ucsd')
      appendIfPresent('ucsv')
      appendIfPresent('ucsf')
      appendIfPresent('ui_lang')
      appendIfPresent('subscribe_type')
      appendIfPresent('show_vis')
      appendIfPresent('show_share')
      appendIfPresent('bg_white')
      appendIfPresent('auth_needed_to_vote')
      appendIfPresent('auth_needed_to_write')
      appendIfPresent('auth_opt_fb')
      appendIfPresent('auth_opt_tw')
      appendIfPresent('auth_opt_allow_3rdparty')
      appendIfPresent('dwok')
      appendIfPresent('topic')

      return paramStrings.length ? '?' + paramStrings.join('&') : ''
    },
  },
  watch: {
    id: {
      handler(value) {
        if (!value)
          throw new Error(
            'Error: Missing necessary identifier (conversation_id or site_id + page_id) to initialize polis conversation.'
          )
      },
      immediate: true,
    },
    // TODO: something to cause a reload of iframe if there is an initialization var that's changed
  },
  mounted() {
    // set available width
    this.availableWidth = window.innerWidth

    // fallback for parent_url
    this.localParentUrl = window.location + ''

    // use window url xid if there is no xid prop passed in
    this.urlXid =
      parseQueryParams('#', window.location.hash).xid ||
      parseQueryParams('?', window.location.search).xid

    // handle message events
    window.addEventListener('message', this.handleFrameMessage, false)

    function parseQueryParams(startToken, s) {
      if (typeof s !== 'string') {
        return {}
      }
      if (s.charAt(0) === startToken) {
        s = s.slice(1)
      }
      var pairStrings = s.split('&')
      var o = {}
      for (var i = 0; i < pairStrings.length; i++) {
        var pair = pairStrings[i].split('=')
        o[pair[0]] = decodeURIComponent(pair[1])
      }
      return o
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleFrameMessage)
  },
  methods: {
    handleFrameMessage(event) {
      var data = event.data || {}
      var domain = event.origin.replace(/^https?:\/\//, '')
      if (!domain.match(/(^|\.)pol.is$/)) {
        // ignore things not from polis
        return
      }

      // particularly unsure about this part
      if (data.polisFrameId) {
        if (`polis_${data.polisFrameId}` !== this.id) {
          return
        }
      } else if (data.name == 'init' && data.conversation.conversation_id) {
        if (data.conversation.conversation_id !== this.conversation_id) return
      }

      if (data === 'cookieRedirect' && cookiesEnabledAtTopLevel()) {
        window.location =
          this.polisUrl +
          '/api/v3/launchPrep?dest=' +
          encodeReturnUrl(window.location + '')
      } else if (data.name === 'init') {
        this.$emit('init', data)
      } else if (data.polisFrameId && data.name) {
        // for some reason the original code emits init two times
        if (data.name !== 'resize') this.$emit(data.name, data)
        else {
          // don't expose resize listener yet, since there's no good way of defining the height from outside the element
          // if (this.$listeners.resize) {
          //   this.$listeners.resize(data)
          // } else {
          this.localHeight = Math.max(data.height, this.localHeight)
          // }
        }
      }

      function cookiesEnabledAtTopLevel() {
        // create a temporary cookie
        var soon = new Date(Date.now() + 1000).toUTCString()
        var teststring = '_polistest_cookiesenabled'
        document.cookie = teststring + '=1; expires=' + soon
        // see if it worked
        var cookieEnabled = document.cookie.indexOf(teststring) != -1
        // clear the cookie
        document.cookie = teststring + '=; expires=' + new Date(0).toUTCString()
        return cookieEnabled
      }

      function encodeReturnUrl(str) {
        var x, i
        var result = ''
        for (i = 0; i < str.length; i++) {
          x = str.charCodeAt(i).toString(16)
          result += ('000' + x).slice(-4)
        }
        return result
      }
    },
  },
}
</script>
