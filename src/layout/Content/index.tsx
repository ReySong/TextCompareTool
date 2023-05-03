import { Card, Col, Row } from "antd";
import { FC, useEffect, useState } from "react";

import "./style.less";
import { OperateArea } from "./components/OperateArea";
import { DisplayArea } from "./components/DisplayArea";

import type { UploadType } from "@/type";

export const Content: FC = () => {
  const [documentHeight, setDocumentHeight] = useState(600);
  const [displayType, setDisplayType] = useState<UploadType>("text");

  useEffect(() => {
    setDocumentHeight(
      window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
    );
  }, [
    window.innerHeight,
    document.documentElement.clientHeight,
    document.body.clientHeight,
  ]);

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card style={{ height: documentHeight - 20, overflow: "scroll" }}>
            <OperateArea
              displayType={displayType}
              setDisplayType={setDisplayType}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ height: documentHeight - 20, overflow: "scroll" }}>
            <DisplayArea
              containerHeight={documentHeight}
              displayType={displayType}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
