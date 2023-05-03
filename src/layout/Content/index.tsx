import { Card, Col, Row } from "antd";
import { FC, useEffect, useState } from "react";

import "./style.less";
import { OperateArea } from "./components/OperateArea";
import { DisplayArea } from "./components/DisplayArea";
import { useFileStore } from "@/store";

import type { DiffInfo, UploadType } from "@/type";

export const Content: FC = () => {
  const [documentHeight, setDocumentHeight] = useState(600);
  const [displayType, setDisplayType] = useState<UploadType>("text");

  useEffect(() => {
    setDocumentHeight(
      document.documentElement.clientHeight || document.body.clientHeight
    );
  }, [document.documentElement.clientHeight, document.body.clientHeight]);

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card style={{ height: documentHeight - 20 }}>
            <OperateArea
              displayType={displayType}
              setDisplayType={setDisplayType}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ height: documentHeight - 20 }}>
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
