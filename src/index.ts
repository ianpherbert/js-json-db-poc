import DataController from "./DataController";
import { UserInfo } from "./UserInfo";

(async () => {
  const controller = await DataController.BuildDataController<UserInfo>(
    "v1",
  );
  const data = controller.query({ firstName: "Veronica" });
  console.log(data);
})();