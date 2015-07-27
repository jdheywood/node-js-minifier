import { start } from "./server";
import { route } from "./router";
import * as handler from "./requestHandlers";

var handle = {}
handle["/"] = handler.start;
handle["/start"] = handler.start;
handle["/upload"] = handler.upload;
handle["/show"] = handler.show;
handle["/test"] = handler.test;

start(route, handle);