import { Button, Upload, UploadFile, UploadProps } from "antd";
import { useState } from "react";
import supabase from "./supabase";
import { UploadOutlined } from "@ant-design/icons";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET;

const App = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const customRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      const uploadFile = file as UploadFile;
      const { data, error } = await supabase.storage
        .from(supabaseBucket)
        .upload(`public/${uploadFile.name}`, uploadFile, { upsert: true });

      if (error) {
        throw new Error();
      }

      const publicUrl =
        supabaseUrl +
        "/storage/v1/object/public/" +
        `${supabaseBucket}/` +
        data.path;

      console.log(publicUrl);

      onSuccess?.("File uploaded successfully!");
    } catch (error) {
      onError?.({ message: "File upload failed.", name: "Upload Error" });
    }
  };

  const onChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
  };

  const onRemove: UploadProps["onRemove"] = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const uploadProps: UploadProps = {
    customRequest,
    fileList,
    onChange,
    onRemove,
  };
  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Click to upload file</Button>
    </Upload>
  );
};

export default App;
