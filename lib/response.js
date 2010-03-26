function sendResponse(req, res, next) {
      // where is this info body
      "(code, body, content_type, extra_headers)"
      res.writeHead(code, (extra_headers || []).concat(
                           [ ["Content-Type", content_type],
                             ["Content-Length", body.length]
                           ]));
      res.write(body);
      res.close();
}
