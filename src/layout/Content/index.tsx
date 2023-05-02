import { Card, Col, Row } from "antd";
import { FC, useState } from "react";

import "./style.less";
import { OperateArea } from "./components/OperateArea";
import { DisplayArea } from "./components/DisplayArea";
import { useFileStore } from "@/store";

import type { DiffInfo, UploadType } from "@/type";

export const Content: FC = () => {
  const height = "600px";
  const [displayType, setDisplayType] = useState<UploadType>("text");

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card style={{ height }}>
            <OperateArea
              displayType={displayType}
              setDisplayType={setDisplayType}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ height }}>
            <DisplayArea displayType={displayType} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
